import { useState } from 'react'
import ReactQuill from 'react-quill'
import { Form, Button } from 'react-bootstrap';
import { addBlog } from './services/BlogService';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px'];
ReactQuill.Quill.register(Size, true);

const TextEditor = () => {
	const [content, setContent] = useState('')
	const [image, setImage] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

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
	}

	const submitHandler = async () => {
		const formData = new FormData()
		formData.append('image', image)
		formData.append('content', content)
		formData.append('title', title)
		formData.append('description', description)
		try {
			await addBlog(formData)
		} catch (e) {
			console.log("e", e)
		}
	}

	return (
		<div style={{ margin: '10px 20% 10px 20%' }}>
			<Form>
				<Form.Group className="mb-2" controlId="title">
					<Form.Label>Title</Form.Label>
					<Form.Control type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
				</Form.Group>
				<Form.Group className="mb-2" controlId="description">
					<Form.Label>Description</Form.Label>
					<Form.Control type="text" placeholder="Title" onChange={(e) => setDescription(e.target.value)} />
				</Form.Group>
				<Form.Group className="mb-2" controlId="posterImage">
					<Form.Label>Poster Image</Form.Label>
					<Form.Control type="file" placeholder="Upload Image" onChange={selectImage} />
				</Form.Group>
				<Form.Group className="mb-2" controlId="posterImage">
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
