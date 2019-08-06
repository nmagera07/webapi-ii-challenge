const router = require('express').Router()

const Posts = require('../db')

const Comments = require('../db')


router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({ error: 'The posts could not be retrieved.'})
        })
    
})

router.get('/:id', (req, res) => {
    const postsId = req.params.id
    Posts.findById(postsId)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ error: 'The post with the specified ID could not be found.'})
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The post could not be retrieved.'})
        })
})

router.get('/:id/comments', (req, res) => {
    const postsId = req.params.id
    const id = req.body.id
    Comments.findPostComments(postsId)
        .then(comment => {
            if (id) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({ error: 'The post with the specified ID could not be found.'})
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The post could not be retrieved.'})
        })
})

router.post('/', (req, res) => {
    const postInfo = req.body
    if (postInfo.title && postInfo.contents) {
        console.log(postInfo)
        Posts.insert(postInfo)
        .then(posts => {
            res.status(201).json(postInfo)
        })
        .catch(error => {
            res.status(500).json({ error: 'There was an error saving a post to the database.'})
        })
    } else {
        res.status(400).json({ error: 'Please provide title and contents for the post.'})
    }
    
})

router.post('/:id/comments', (req, res) => {
    const commentInfo = req.body
    const commentId = req.params.id
    if (commentInfo.text) {
        Comments.insert(commentInfo)
            .then(comments => {
                res.status(201).json(comments)
            })
            .catch(404).json({ error: 'Please provide text for the comment. ' })
    } else if (commentId) {
        Comments.insert()
    }
})

router.delete('/:id', (req, res) => {
    const userId = req.params.id 
    const posts = Posts.findById(userId).then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        console.log(error)
    })

    Posts.remove(userId)
        .then(post => {
            res.status(200).json( posts)
        })
        .catch(error => {
            res.status(500).json({ error: 'Post could not be deleted.'})
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    if (changes.title && changes.contents) {
        Posts.update(id, changes)
            .then(updated => {
                if (updated) {
                    res.status(200).json(updated)
                } else {
                    res.status(404).json({ error: 'The post with the specified ID does not exist.'})
                }
            })
            .catch(error => {
                res.status(500).json({ error: 'The post information could not be modified.'})
            })
    } else {
        res.status(400).json({ error: 'Please provide title and contents for post.'})
    }
})


module.exports = router