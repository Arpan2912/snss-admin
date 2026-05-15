import { useEffect, useState } from 'react';
import { getArticles, updateArticle } from '../services/ArticleService';
import { Table, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Articles(props) {
    let navigate = useNavigate();

    const [articles, setArticles] = useState([]);
    const [bucketUrl, setBucketUrl] = useState(null);

    useEffect(() => {
        console.log("props", props)
        getAllArticles();
    }, [])

    const getAllArticles = async () => {
        const articlesResponse = await getArticles();
        console.log("articlesResponse", articlesResponse)
        const { data: { articles: articlesData, bucketUrl } } = articlesResponse;
        console.log("articlesData", articlesData)
        setArticles(articlesData);
        setBucketUrl(bucketUrl)
    }

    const openArticle = (article) => {
        if (article) {
            navigate('/add-article', { state: { article, bucketUrl } })
        } else {
            navigate('/add-article')
        }
    }

    const unpublishArticle = async (article) => {
        const updateObj = {
            uuid: article.uuid,
            isPublished: !article.is_published
        }

        await updateArticle(updateObj);
        await getAllArticles();
    }

    const deleteArticle = async (article) => {
        const updateObj = {
            uuid: article.uuid,
            isDeleted: true
        }

        await updateArticle(updateObj);
        await getAllArticles();
    }

    const copyToClipboard = (url) => {
        const textToCopy = `https://www.snssindia.in/api/article/${url}`
        alert(textToCopy);
    }

    return (
        <div
            style={{ marginLeft: '100px', marginRight: '100px', marginTop: '20px' }}
        >
            <Row>
                <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <Button onClick={() => openArticle()}>Add</Button>
                </Col>
            </Row>
            <Row>
                <Table className='striped bordered hover'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Forum</th>
                            <th>Created By</th>
                            <th>Created Date</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((a) => <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.title}</td>
                            <td>{a.forum || a.category}</td>
                            <td>{a.created_by}</td>
                            <td>{a.created_at}</td>
                            <td>{!(a.is_published === null || a.is_published === undefined) && a.is_published.toString()}</td>
                            <td>
                                <Button variant="primary" onClick={() => copyToClipboard(a.url)} style={{ fontSize: '14px' }}>Share</Button>{' '}
                                <Button variant="primary" onClick={() => openArticle(a)} style={{ fontSize: '14px' }}>Edit</Button>{' '}
                                <Button variant="danger" style={{ fontSize: '14px' }} onClick={() => deleteArticle(a)}>Delete</Button>{' '}
                                <Button variant="warning" style={{ fontSize: '14px' }} onClick={() => unpublishArticle(a)}>{a.is_published ? 'Unpublish' : 'Publish'}</Button>{' '}
                            </td>
                        </tr>)}
                    </tbody>
                </Table>
            </Row>
        </div>)
}
