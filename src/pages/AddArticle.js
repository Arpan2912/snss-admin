import { useState, useEffect } from 'react'
import { Form, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addArticle, updateArticle, getArticleDetail } from '../services/ArticleService';
import { uploadFileToS3 } from '../services/UploadService';

const TextEditor = () => {
    const [uuid, setUuid] = useState(null)
    const [attachments, setAttachments] = useState('');
    const [oldAttachments, setOldAttachments] = useState([]);
    const [title, setTitle] = useState('');
    const [forum, setForum] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bucketUrl, setBucketUrl] = useState('')
    const [deletedAttachments, setDeletedAttachments] = useState([])
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const { state = {} } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let article, bucketUrl;
        if (state) {
            article = state.article;
            bucketUrl = state.bucketUrl;
        }
        if (article && article.uuid) {
            getArticleDetailFunc(article.uuid)
        }
        if (bucketUrl) {
            setBucketUrl(bucketUrl)
        }
    }, [])

    const getArticleDetailFunc = async (uuid) => {
        const articleDetail = await getArticleDetail(uuid);
        const { article, bucketUrl } = articleDetail.data;
        setBucketUrl(bucketUrl);
        setArticleStates(article)
    }

    const setArticleStates = (article) => {
        setTitle(article.title);
        setForum(article.forum || '');
        setDate(article.publication_date ? article.publication_date.split('T')[0] : new Date().toISOString().split('T')[0]);
        setUuid(article.uuid);
        if (article.attachments) {
            setOldAttachments(article.attachments);
        }
    }

    const selectAttachment = (e) => {
        setAttachments(e.target.files);
    }

    const submitHandler = async () => {
        try {
            setUploading(true);

            // Step 1: Upload attachments to S3 via presigned URLs
            const attachmentKeys = [];
            if (attachments && attachments.length > 0) {
                for (let i = 0; i < attachments.length; i++) {
                    setUploadProgress(`Uploading file ${i + 1} of ${attachments.length}...`);
                    const result = await uploadFileToS3(attachments[i]);
                    attachmentKeys.push(result);
                }
            }

            // Step 2: Submit article data as JSON (no files in this request)
            setUploadProgress('Saving article...');
            const articleData = {
                title,
                forum,
                date,
                type: 'article',
                createdBy: 'Admin',
                createdByEmail: 'admin@snssindia.in',
                description: title,
                content: title,
                attachmentKeys,
            };

            if (deletedAttachments && deletedAttachments.length > 0) {
                articleData.deletedAttachments = deletedAttachments.join(',');
            }

            let msg = ''
            if (uuid) {
                articleData.uuid = uuid;
                await updateArticle(articleData);
                msg = 'Article updated successfully'
            } else {
                await addArticle(articleData)
                msg = 'Article created successfully'
            }
            alert(msg)
            navigate('/articles')
        } catch (e) {
            console.log("e", e)
            alert('Error processing request')
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    }

    const deleteAttachment = (attachment) => {
        const deletedAttachmentsBlock = [...deletedAttachments];
        deletedAttachmentsBlock.push(attachment.uuid);
        setDeletedAttachments([...deletedAttachmentsBlock])
        setOldAttachments(oldAttachments.filter(a => a.uuid !== attachment.uuid))
    }

    return (
        <div style={{ margin: '30px 25% 30px 25%' }}>
            <h2 className="mb-4">{uuid ? 'Edit Article' : 'Add New Article'}</h2>
            <Form>
                <Form.Group className="mb-3" controlId="forum">
                    <Form.Label>Forum</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g. BCAJ, ICAI"
                        value={forum}
                        onChange={(e) => setForum(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Topic (Title)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Article Topic"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="date">
                    <Form.Label>Publication Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="attachment">
                    <Form.Label>Attachments (PDF)</Form.Label>
                    {oldAttachments && oldAttachments.map((a) =>
                        <div key={a.uuid} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                            <span>{a.attachment}</span>
                            <Button variant="danger" size="sm" onClick={() => deleteAttachment(a)}>X</Button>
                        </div>
                    )}
                    <Form.Control type="file" placeholder="Upload Attachments" multiple onChange={selectAttachment} />
                </Form.Group>

                {uploading && (
                    <div className="mb-3">
                        <ProgressBar animated now={100} label={uploadProgress} />
                    </div>
                )}

                <div className="d-grid gap-2 mt-4">
                    <Button variant="primary" size="lg" onClick={submitHandler} disabled={uploading}>
                        {uploading ? uploadProgress : (uuid ? 'Update Article' : 'Create Article')}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => navigate('/articles')} disabled={uploading}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div >
    )
}

export default TextEditor
