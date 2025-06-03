import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { describe, test, beforeEach, expect } from 'vitest'



describe('Blog component', () => {
  let blog
  let currentUser

  beforeEach(() => {
    blog = {
      title: 'Test Driven Development in React',
      author: 'Kent Beck',
      url: 'http://example.com/blog',
      likes: 5,
      user: {
        username: 'testaaja',
        name: 'meitsi'
      }
    }
    currentUser = {
      username: 'testaaja',
      name: 'meitsi'
    }
  })

  test('renders blog title', () => {
    render(<Blog blog={blog} currentUser={currentUser} />)
    expect(screen.getByText('Test Driven Development in React', { exact: false })).toBeDefined()
  })


  test('url, likes and author after view', async () => {
    render(<Blog blog={blog} currentUser={currentUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('http://example.com/blog')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('Kent Beck'),{ exact: false }).toBeDefined()
  })

  test('clicking the button twice calls event hanlder twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} currentUser={currentUser} onLike={mockHandler}/>)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})