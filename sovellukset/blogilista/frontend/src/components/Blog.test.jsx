import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title', () => {
  const blog = {
    title: 'Test Driven Development in React',
    author: 'Kent Beck',
    url: 'http://example.com/blog',
    likes: 5,
    user: {
      username: 'testaaja',
      name: 'meitsi'
    }
  }

  const currentUser = {
    username: 'testaaja',
    name: 'meitsi'
  }

  render(<Blog blog={blog} currentUser={currentUser} />)

  expect(screen.getByText('Test Driven Development in React', { exact: false })).toBeDefined()
})
