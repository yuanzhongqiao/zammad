// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { axe } from 'vitest-axe'
import { mockApplicationConfig } from '#tests/support/mock-applicationConfig.ts'
import { visitView } from '#tests/support/components/visitView.ts'
import '#tests/graphql/builders/mocks.ts'

describe('testing login a11y', () => {
  beforeEach(() => {
    mockApplicationConfig({
      product_name: 'Zammad Test System',
    })
  })

  it('has no accessibility violations', async () => {
    const view = await visitView('/login')
    const results = await axe(view.html())
    expect(results).toHaveNoViolations()
  })
})
