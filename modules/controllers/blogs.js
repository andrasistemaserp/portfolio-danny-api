const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const slugify = require('slugify')
const uniqueSlug = require('unique-slug');
const { getAccessToken, getAuth0User } = require('./auth');

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createAt: -1 })
  // return res.json(blogs)
  const { access_token } = await getAccessToken();
  const blogsWithUsers = [];
  const authors = {};

  for (let blog of blogs) {
    const author = authors[blog.userId] || await getAuth0User(access_token)(blog.userId);
    authors[author.user_id] = author;
    blogsWithUsers.push({blog, author});
  }

  // const picture = await changePictureTest(access_token);
  
  return res.json(blogsWithUsers);
  
}

exports.getBlogsByUser = async (req, res) => {
  const userId = req.user.sub;
  const blogs = await Blog.find({
    userId,
    status: { $in: ['draft', 'published'] }
  });
  return res.json(blogs);
}

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.json(blog);
}

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
  const { access_token } = await getAccessToken();
  const author = await getAuth0User(access_token)(blog.userId);

  return res.json({ blog, author });
}

exports.createBlog = async (req, res) => {
  const blogData = req.body;
  const userId = req.user.sub  //Id origin of auth0.com/User Magnmet/Users user adm 
  const blog = new Blog(blogData);
  blog.userId = userId

  try {
    const createdBlog = await blog.save();
    return res.json(createdBlog);
  } catch (error) {
    return res.status(422).send(error.message);
  }
}

exports.updateBlog = async (req, res) => {
  const { body, params: { id } } = req;

  Blog.findById(id, async (error, blog) => {

    if (error) {
      return res.status(422).send(error.message);
    }

    if (body.status && body.status === 'published' && !blog.slug) {
      blog.slug = slugify(blog.title, {
        replacement: '-',
        lower: true
      })
    }

    const _saveBlog = async (blog) => {
      try {
        const createdBlog = await blog.save()
        return createdBlog
      } catch (error) {
        if (error.code = 11000 && error.keyPattern && error.keyPattern.slug) {
          blog.slug += `-${uniqueSlug()}` //'-uniqueSlug'
          return _saveBlog(blog)
        }

        throw (error)
      }
    }

    blog.set(body)
    blog.updateAt = new Date()

    try {
      const updateBlog = await _saveBlog(blog)
      return res.json(updateBlog)
    } catch (error) {
      return res.status(422).send(error.message);
    }

  })
}

// exports.deleteBlog = async (req, res) => {
//   const { params: { id } } = req;

//   try {
//     const deletedPortfolio = await Portfolio.findByIdAndRemove({_id: id})
//     return res.json({_id: deletedPortfolio.id})
//   } catch (error) {
//     return res.status(422).send(error.message)
//   }
// }

