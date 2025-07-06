import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing with react-testing-library',
  author: 'Joku Kumma',
  url: 'https://fullstackopen.com/en/part5/testing_react_apps',
  likes: 0,
  user: { name: 'root' },
}

describe('<Blog />', () => {
  test('renders title and author', () => {
    const { container } = render(<Blog blog={blog} user={blog.user} />)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(blog.likes)).toBeNull()
  })

  test('renders url and likes when view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} user={blog.user} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(blog.url)
    expect(div).toHaveTextContent(blog.likes)
  })

  test('clicking the button calls event handler correctly', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} user={blog.user} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
