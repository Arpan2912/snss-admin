import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addBlog, updateBlog, getBlogDetail } from '../services/BlogService';
import { uploadFileToS3 } from '../services/UploadService';
import { categories, subCategories } from '../constant/category';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px'];
ReactQuill.Quill.register(Size, true);

const blogUser = [
	{
		name: 'Niranjan Shah',
		email: 'niranjan@snssindia.in'
	},
	{
		name: 'Sanyam Shah',
		email: 'sanyam@snssindia.in'
	}
]

const typeOptions = [
	{
		name: 'Blog',
		value: 'blog'
	},
	{
		name: 'News and Update',
		value: 'news_and_update'
	},
	{
		name: 'Article',
		value: 'article'
	},
]
const TextEditor = () => {
	const [content, setContent] = useState('')
	const [uuid, setUuid] = useState(null)
	const [image, setImage] = useState('');
	const [attachments, setAttachments] = useState('');
	const [oldAttachments, setOldAttachments] = useState([]);
	const [oldImage, setOldImage] = useState('');
	const [newImage, setNewImage] = useState('');
	const [title, setTitle] = useState('');
	const [type, setType] = useState('blog');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [subCategory, setSubCategory] = useState('');
	const [createdBy, setCreatedBy] = useState('');
	const [createdByEmail, setCreatedByEmail] = useState('');
	const [bucketUrl, setBucketUrl] = useState('')
	const [deletedAttachments, setDeletedAttachments] = useState([])
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState('');
	const { state = {} } = useLocation();
	const navigate = useNavigate();
	// const [blogs, setBlogs] = useState([]);
	// const [bucketUrl, setBucketUrl] = useState([]);
	useEffect(() => {
		let blog, bucketUrl;
		console.log("props", blog)
		if (state) {
			blog = state.blog;
			bucketUrl = state.bucketUrl;
		}
		if (blog && blog.uuid) {
			getBlogDetailFunc(blog.url)
		}
		if (bucketUrl) {
			setBucketUrl(bucketUrl)
		}
		// getAllBlogs();
	}, [])

	const toolbarOptions = [
		[{ header: [1, 2, 3, 4, 5, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ color: [] }],
		// ['link', 'image'],
		['clean'],
		[{ align: ['', 'justify', 'right', 'center'] }],
		[{ 'size': ['14px', '16px', '18px'] }]
	]

	const modules = {
		toolbar: toolbarOptions,
	}

	const getBlogDetailFunc = async (uuid) => {
		const blogDetail = await getBlogDetail(uuid);
		const { blog, bucketUrl } = blogDetail.data;
		setBucketUrl(bucketUrl);
		setBlogStates(blog)
		// console.log("blogDetail", blogDetail);
	}

	const setBlogStates = (blog) => {
		setTitle(blog.title);
		setDescription(blog.description);
		setCategory(blog.category);
		setSubCategory(blog.sub_category || '');
		setContent(blog.content);
		setOldImage(blog.poster_image);
		setCreatedBy(blog.created_by);
		setCreatedByEmail(blog.created_by_email);
		setType(blog.type || 'blog');
		setUuid(blog.uuid);
		if (blog.attachments) {
			setOldAttachments(blog.attachments);
		}
	}


	const selectImage = (e) => {
		console.log("e", e.target.files)
		console.log("e", e.target.file)
		setImage(e.target.files[0]);
		const newImage = URL.createObjectURL(e.target.files[0])
		console.log("newImage", newImage)
		setNewImage(newImage)
	}

	const selectAttachment = (e) => {
		console.log("e", e.target.files)
		console.log("e", e.target.file)
		setAttachments(e.target.files);
	}


	const submitHandler = async () => {
		try {
			setUploading(true);
			let uploadStep = 0;
			const totalUploads = (image ? 1 : 0) + (attachments ? attachments.length : 0);

			// Step 1: Upload poster image to S3 via presigned URL
			let posterImageKey = null;
			if (image) {
				uploadStep++;
				setUploadProgress(`Uploading image (${uploadStep}/${totalUploads})...`);
				const imageResult = await uploadFileToS3(image);
				posterImageKey = imageResult.key;
			}

			// Step 2: Upload attachments to S3 via presigned URLs
			const attachmentKeys = [];
			if (attachments && attachments.length > 0) {
				for (let i = 0; i < attachments.length; i++) {
					uploadStep++;
					setUploadProgress(`Uploading file ${uploadStep}/${totalUploads}...`);
					const result = await uploadFileToS3(attachments[i]);
					attachmentKeys.push(result);
				}
			}

			// Step 3: Submit blog data as JSON (no files in this request)
			setUploadProgress('Saving blog...');

			const createdByUserDetail = blogUser.find((b) => b.name === createdBy);
			const createdByUserEmail = createdByUserDetail && createdByUserDetail.email ? createdByUserDetail.email : '';

			const blogData = {
				content,
				title,
				description,
				category,
				subCategory,
				createdBy,
				type,
				createdByEmail: createdByUserEmail,
				posterImageKey,
				attachmentKeys,
			};

			if (deletedAttachments && deletedAttachments.length > 0) {
				blogData.deletedAttachments = deletedAttachments.join(',');
			}

			let msg = ''
			if (uuid) {
				blogData.uuid = uuid;
				await updateBlog(blogData);
				msg = 'Blog updated successfully'
			} else {
				await addBlog(blogData)
				msg = 'Blog created successfully'
			}
			alert(msg)
			navigate('/')
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
	}

	return (
		<div style={{ margin: '10px 20% 10px 20%' }}>
			<Form>
				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Category</Form.Label>
					<Form.Select aria-label="" value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }}>
						<option>Select</option>
						{categories.map((c) => <option value={c.value}>{c.name}</option>)}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Sub Category</Form.Label>
					<Form.Select aria-label="" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
						<option>Select</option>
						{category && subCategories[category] && subCategories[category].map((c) => <option value={c.value}>{c.name}</option>)}
					</Form.Select>
				</Form.Group>
				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Type</Form.Label>
					<Form.Select aria-label="" value={type} onChange={(e) => setType(e.target.value)}>
						{typeOptions.map((c) => <option value={c.value}>{c.name}</option>)}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-2" controlId="created_by">
					<Form.Label>Created By</Form.Label>
					<Form.Select aria-label="" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
						<option>Select</option>
						{blogUser.map((b) => <option value={b.name}>{b.name}</option>)}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-2" controlId="title">
					<Form.Label>Title</Form.Label>
					<Form.Control
						type="text"
						placeholder="Title"
						value={title}
						maxLength={60}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<div className='input-count-text'>{title.length}/60</div>
				</Form.Group>
				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Description</Form.Label>
					<Form.Control
						type="text"
						placeholder="Description"
						value={description}
						maxLength={200}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div className='input-count-text'>{description.length}/200</div>
				</Form.Group>

				<Form.Group className="mb-2" controlId="posterImage">
					<Form.Label>Poster Image</Form.Label>
					{!newImage && oldImage && <img className='blog-poster-image' src={`${bucketUrl}/${oldImage}`}></img>}
					{newImage && <img className='blog-poster-image' src={`${newImage}`}></img>}
					<Form.Control type="file" placeholder="Upload Image" onChange={selectImage} />
				</Form.Group>

				<Form.Group className="mb-2" controlId="content">
					<Form.Label>Content</Form.Label>
					<Form.Control as="textarea" rows={20} value={content} onChange={(v) => setContent(v.target.value)} />

					{/* <ReactQuill
						value={content}
						modules={modules}
						onChange={(v) => setContent(v)}
					/> */}
				</Form.Group>

				<Form.Group className="mb-2" controlId="attachment">
					<Form.Label>Attachments</Form.Label>
					{oldAttachments && oldAttachments.map((a) =>
						<div>{a.attachment} <span onClick={() => deleteAttachment(a)}>X</span></div>
					)}
					{/* {!newImage && oldImage && <img className='blog-poster-image' src={`${bucketUrl}/${oldImage}`}></img>} */}
					{/* {newImage && <img className='blog-poster-image' src={`${newImage}`}></img>} */}
					<Form.Control type="file" placeholder="Upload Attachments" multiple onChange={selectAttachment} />
				</Form.Group>

				{uploading && (
					<div className="mb-3">
						<ProgressBar animated now={100} label={uploadProgress} />
					</div>
				)}

				<Button onClick={submitHandler} disabled={uploading}>
					{uploading ? uploadProgress : 'Submit'}
				</Button>
			</Form>
			<h3>Preview</h3>
			<Card>
				<Card.Body>
					<div className='blog-content' dangerouslySetInnerHTML={{ __html: content }} />
				</Card.Body>
			</Card>
		</div >
	)
}

export default TextEditor
