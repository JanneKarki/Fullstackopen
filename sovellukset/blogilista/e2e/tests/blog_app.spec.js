const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testaaja',
        username: 'meitsi2',
        password: 'salasana'
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('Successful login', async ({ page }) => {
    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('salasana')
    await page.getByRole('button', { name: 'login' }).click()

    await page.waitForSelector('text=testaaja logged in') 
  })

  test('Unsuccessful login', async ({ page }) => {
    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('vääräsalasana')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.locator('.error')).toContainText('Wrong username or password')
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testaaja',
        username: 'meitsi2',
        password: 'salasana'
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('create new blog', async ({ page }) => {
    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('salasana')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.locator('text=testaaja logged in')).toBeVisible()

    await page.getByRole('button', { name: 'new blog' }).click() 
  
    await page.getByTestId('title').fill('Playwright blogi')
    await page.getByTestId('author').fill('Testaaja')
    await page.getByTestId('url').fill('https://testi.com')
    await page.getByRole('button', { name: 'create' }).click()
  
    const blog = page.getByTestId('blog')
    await blog.waitFor({ state: 'visible', timeout: 10000 })
    await expect(blog).toHaveText(/Playwright blogi/)
    })  
})