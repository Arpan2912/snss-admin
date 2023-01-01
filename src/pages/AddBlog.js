import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addBlog, updateBlog } from '../services/BlogService';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px'];
ReactQuill.Quill.register(Size, true);
const categories = [
	{
		name: 'Valuation Scoop',
		value: 'valuation'
	},
	{
		name: 'Tax Tides',
		value: 'tax'
	},
	{
		name: 'Fema Flash',
		value: 'fema'
	}
];

const subCategories = {
	tax: [
		{
			name: 'Direct Tax',
			value: 'direct_tax'
		},
		{
			name: 'Indirect Tax',
			value: 'indirect_tax'
		},
		{
			name: 'GST',
			value: 'gst'
		}
	]
}

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
const TextEditor = () => {
	const [content, setContent] = useState('')
	const [uuid, setUuid] = useState(null)
	const [image, setImage] = useState('');
	const [oldImage, setOldImage] = useState('');
	const [newImage, setNewImage] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [subCategory, setSubCategory] = useState('');
	const [createdBy, setCreatedBy] = useState('');
	const [createdByEmail, setCreatedByEmail] = useState('');
	const [bucketUrl, setBucketUrl] = useState('')
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
		if (blog) {
			setTitle(blog.title);
			setDescription(blog.description);
			setCategory(blog.category);
			setSubCategory(blog.sub_category || '');
			setContent(blog.content);
			setOldImage(blog.poster_image);
			setCreatedBy(blog.created_by);
			setCreatedByEmail(blog.created_by_email);
			setUuid(blog.uuid);
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

	const selectImage = (e) => {
		console.log("e", e.target.files)
		console.log("e", e.target.file)
		setImage(e.target.files[0]);
		const newImage = URL.createObjectURL(e.target.files[0])
		console.log("newImage", newImage)
		setNewImage(newImage)
	}

	const submitHandler = async () => {
		const formData = new FormData()
		formData.append('content', content)
		formData.append('title', title)
		formData.append('description', description)
		formData.append('category', category)
		formData.append('subCategory', subCategory)
		formData.append('createdBy', createdBy)

		const createdByUserDetail = blogUser.find((b) => b.name === createdBy);
		const createdByUserEmail = createdByUserDetail && createdByUserDetail.email ? createdByUserDetail.email : '';

		formData.append('createdByEmail', createdByUserEmail);

		if (image) {
			formData.append('image', image)
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
