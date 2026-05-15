import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addArticle, updateArticle, getArticleDetail } from '../services/ArticleService';

const TextEditor = () => {
    const [uuid, setUuid] = useState(null)
    const [attachments, setAttachments] = useState('');
    const [oldAttachments, setOldAttachments] = useState([]);
    const [title, setTitle] = useState('');
    const [forum, setForum] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bucketUrl, setBucketUrl] = useState('')
    const [deletedAttachments, setDeletedAttachments] = useState([])
    const { state = {} } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let article, bucketUrl;
        if (state) {
            article = state.article;
            bucketUrl = state.bucketUrl;
        }
        if (article && article.uuid) {
            getArticleDetailFunc(article.url)
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
        const formData = new FormData()
        formData.append('title', title)
        formData.append('forum', forum)
        formData.append('date', date)
        formData.append('type', 'article') // Ensure type is article
        formData.append('createdBy', 'Admin')
        formData.append('createdByEmail', 'admin@snssindia.in')
        formData.append('description', title) // Use title as fallback description
        formData.append('content', title) // Use title as fallback content

        if (attachments) {
            for (let i = 0; i < attachments.length; i++) {
                formData.append('attachment', attachments[i])
            }
        }
        if (deletedAttachments && deletedAttachments.length > 0) {
            formData.append('deletedAttachments', deletedAttachments.join(','))
        }

        let msg = ''
        try {
            if (uuid) {
                formData.append('uuid', uuid)
                await updateArticle(formData);
                msg = 'Article updated successfully'
            } else {
                await addArticle(formData)
                msg = 'Article created successfully'
            }
            alert(msg)
            navigate('/articles')
        } catch (e) {
            console.log("e", e)
            alert('Error processing request')
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

                <div className="d-grid gap-2 mt-4">
                    <Button variant="primary" size="lg" onClick={submitHandler}>
                        {uuid ? 'Update Article' : 'Create Article'}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => navigate('/articles')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div >
    )
}

export default TextEditor
