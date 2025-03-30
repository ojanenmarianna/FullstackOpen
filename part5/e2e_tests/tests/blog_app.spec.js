const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlogWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('User mluukkai successfully logged in')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlogWith(page, 'Test blog', 'Tester', 'https://printatestpage.com/')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlogWith(page, 'Lorem ipsum', 'John Doe', 'https://www.lipsum.com/')
      await expect(page.getByText('a new blog Lorem ipsum by John Doe added')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user can delete own blog', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('Remove blog Test blog by Tester')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Removed Test blog')).toBeVisible()
    })

    test('user can only remove own blogs', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Teppo Testaaja',
          username: 'ttest',
          password: 'secret'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'ttest', 'secret')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlogWith(page, 'Lorem ipsum', 'John Doe', 'https://www.lipsum.com/')
      })

      test('blogs are ordered by likes', async ({ page }) => {
        const blogTitles = ['Test blog', 'Lorem ipsum']
        for (const title of blogTitles) {
          await page.getByText(title).getByRole('button', { name: 'view' }).click()
        }

        const otherBlogElement = await page.getByText('Test blog')
        await otherBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(otherBlogElement.getByText('likes 1')).toBeVisible()

        const firstBlogElement = await page.getByText('Lorem ipsum')
        await firstBlogElement.getByRole('button', { name: 'like' }).click()
        await firstBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(firstBlogElement.getByText('likes 2')).toBeVisible()

        const firstBlog = await page.locator('.blog').first()
        await expect(firstBlog).toContainText('Lorem ipsum')
      })
    })
  })
})