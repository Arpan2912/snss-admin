import { useEffect, useState } from 'react';
// import Header from '../components/Header';
import { getBlogs } from '../services/BlogService';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
        {blogs.map((b) => <Col md={4}>
          <Card style={{ margin: '0px 2px 0px 2px' }} >
            {bucketUrl && <img src={`${bucketUrl}/${b.poster_image}`} className="poster-list-image"></img>}
            <Card.Body>
              <div onClick={() => openBlog(b)} className="blog-list-title">{b.title}</div>
              <div className="blog-list-description">{b.description}</div>
            </Card.Body>
          </Card>
        </Col>
        )}
      </Row>
    </div>)
}