import { useEffect, useState } from 'react';
// import Header from '../components/Header';
import { getBlogs, updateBlog } from '../services/BlogService';
import { Table, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Blogs(props) {
  let navigate = useNavigate();


  const [blogs, setBlogs] = useState([]);
  const [bucketUrl, setBucketUrl] = useState(null);
  useEffect(() => {
    console.log("props", props)
    getAllBlogs();
  }, [])

  const getAllBlogs = async () => {
    const blogsResponse = await getBlogs();
    console.log("blogsResponse", blogsResponse)
    const { data: { blogs: blogsData, bucketUrl } } = blogsResponse;
    console.log("blogsData", blogsData)
    setBlogs(blogsData);
    setBucketUrl(bucketUrl)
  }

  const openBlog = (blog) => {
    if (blog) {
      navigate('/add-blog', { state: { blog, bucketUrl } })
    } else {
      navigate('/add-blog')
    }
  }

  const unpublishBlog = async (blog) => {
    const updateObj = {
      uuid: blog.uuid,
      isPublished: !blog.is_published
    }

    await updateBlog(updateObj);
    await getAllBlogs();
  }

  const deleteBlog = async (blog) => {
    const updateObj = {
      uuid: blog.uuid,
      isDeleted: true
    }

    await updateBlog(updateObj);
    await getAllBlogs();
  }


  return (
    <div
      style={{ marginLeft: '100px', marginRight: '100px', marginTop: '20px' }}
    >
      <Row>
        <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
          <Button onClick={() => openBlog()}>Add</Button>
        </Col>
      </Row>
      <Row>
        <Table className='striped bordered hover'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Type</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => <tr>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.type}</td>
              <td>{b.created_by}</td>
              <td>{b.created_at}</td>
              <td>{!(b.is_published === null || b.is_published === undefined) && b.is_published.toString()}</td>
              <td>
                <Button variant="primary" onClick={() => openBlog(b)} style={{ fontSize: '14px' }}>Edit</Button>{' '}
                <Button variant="danger" style={{ fontSize: '14px' }} onClick={() => deleteBlog(b)}>Delete</Button>{' '}
                <Button variant="warning" style={{ fontSize: '14px' }} onClick={() => unpublishBlog(b)}>{b.is_published ? 'Unpublish' : 'Publish'}</Button>{' '}
              </td>
            </tr>)}
          </tbody>
        </Table>
        )}
      </Row>
    </div>)
}