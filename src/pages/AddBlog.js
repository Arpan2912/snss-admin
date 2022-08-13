import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'
import { addBlog, updateBlog } from '../services/BlogService';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px'];
ReactQuill.Quill.register(Size, true);

const TextEditor = () => {
	const [content, setContent] = useState('')
	const [uuid, setUuid] = useState(null)
	const [image, setImage] = useState('');
	const [oldImage, setOldImage] = useState('');
	const [newImage, setNewImage] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
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
			setContent(blog.content);
			setOldImage(blog.poster_image);
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
					<ReactQuill
						value={content}
						modules={modules}
						onChange={(v) => setContent(v)}
					/>
				</Form.Group>
				<Button onClick={submitHandler}>Submit</Button>
			</Form>
		</div >
	)
}

export default TextEditor
