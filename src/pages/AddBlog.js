import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addBlog, updateBlog, getBlogDetail } from '../services/BlogService';
import { categories, subCategories } from '../constant/category';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px'];
ReactQuill.Quill.register(Size, true);
// const categories = [
// 	{
// 		name: 'Valuation Scoop',
// 		value: 'valuation'
// 	},
// 	{
// 		name: 'Tax Tidings',
// 		value: 'tax'
// 	},
// 	{
// 		name: 'Fema Flash',
// 		value: 'fema'
// 	},
// 	{
// 		name: 'Global Business Setup',
// 		value: 'global_business_setup'
// 	}
// ];

// const subCategories = {
// 	tax: [
// 		{
// 			name: 'Direct Tax',
// 			value: 'direct_tax'
// 		},
// 		{
// 			name: 'International Tax',
// 			value: 'international_tax'
// 		},
// 		{
// 			name: 'Transfer Pricing',
// 			value: 'transfer_pricing'
// 		},
// 		{
// 			name: 'GST',
// 			value: 'gst'
// 		},
// 		{
// 			name: 'NRI taxation',
// 			value: 'nri_taxation'
// 		}
// 	],
// 	fema: [
// 		{
// 			name: 'Foreign Direct Investment',
// 			value: 'foreign_direct_investment'
// 		},
// 		{
// 			name: 'Overseas Investment',
// 			value: 'overseas_investment'
// 		},
// 		{
// 			name: 'External Commercial Borrowings',
// 			value: 'external_commercial_borrowings'
// 		},
// 		{
// 			name: 'Dealing In Immovable properties by NRI',
// 			value: 'dealing_in_immovable_properties_by_nri'
// 		}
// 	],
// 	global_business_setup: [
// 		{
// 			name: 'United Arab Emirates(UAE)',
// 			value: 'uae'
// 		},
// 		{
// 			name: 'United States of America(USA)',
// 			value: 'usa'
// 		},
// 		{
// 			name: 'Canada',
// 			value: 'canada'
// 		}
// 	]
// }

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
			// setTitle(blog.title);
			// setDescription(blog.description);
			// setCategory(blog.category);
			// setSubCategory(blog.sub_category || '');
			// setContent(blog.content);
			// setOldImage(blog.poster_image);
			// setCreatedBy(blog.created_by);
			// setCreatedByEmail(blog.created_by_email);
			// setUuid(blog.uuid);

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
		// const newImage = URL.createObjectURL(e.target.files[0])
		// console.log("newImage", newImage)
		// setNewImage(newImage)
	}


	const submitHandler = async () => {
		const formData = new FormData()
		formData.append('content', content)
		formData.append('title', title)
		formData.append('description', description)
		formData.append('category', category)
		formData.append('subCategory', subCategory)
		formData.append('createdBy', createdBy)
		formData.append('type', type)

		const createdByUserDetail = blogUser.find((b) => b.name === createdBy);
		const createdByUserEmail = createdByUserDetail && createdByUserDetail.email ? createdByUserDetail.email : '';

		formData.append('createdByEmail', createdByUserEmail);

		if (image) {
			formData.append('image', image)
		}
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
				// const obj = {
				// 	content,
				// 	title,
				// 	description,
				// 	uuid: blog.uuid
				// }
				formData.append('uuid', uuid)
				await updateBlog(formData);
				msg = 'Blog updated successfully'
				// await updateBlog(obj);
			} else {
				await addBlog(formData)
				msg = 'Blog creatd successfully'
			}
			alert(msg)
			navigate('/')
		} catch (e) {
			console.log("e", e)
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
					{/* <Form.Control
						type="select"
						placeholder="Category"
						value={category}
						maxLength={200}
						onChange={(e) => setCategory(e.target.value)}
					/> */}
					{/* <div className='input-count-text'>{category.length}/200</div> */}
				</Form.Group>
				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Type</Form.Label>
					<Form.Select aria-label="" value={type} onChange={(e) => setType(e.target.value)}>
						{typeOptions.map((c) => <option value={c.value}>{c.name}</option>)}
					</Form.Select>
					{/* <Form.Control
						type="select"
						placeholder="Category"
						value={category}
						maxLength={200}
						onChange={(e) => setCategory(e.target.value)}
					/> */}
					{/* <div className='input-count-text'>{category.length}/200</div> */}
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
				<Button onClick={submitHandler}>Submit</Button>
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
