import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Component testing with react-testing-library',
    author: 'Joku Kumma',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    user: 'root'
  }

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Component testing with react-testing-library'
  )

  expect(div).toHaveTextContent('Joku Kumma')

  const url = screen.queryByText('https://fullstackopen.com/en/part5/testing_react_apps')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes')
  expect(likes).toBeNull()
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing with react-testing-library',
    author: 'Joku Kumma',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    user: 'root'
  }

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'https://fullstackopen.com/en/part5/testing_react_apps'
  )
  expect(div).toHaveTextContent('likes')
})

test('clicking the button calls event handler correctly', async () => {
  const blog = {
    title: 'Component testing with react-testing-library',
    author: 'Joku Kumma',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    user: 'root'
  }

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