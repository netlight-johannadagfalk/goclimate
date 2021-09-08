import React from 'react';
import { render, fireEvent } from './test-utils.jsx';
import ResultTitle from './ResultTitle.jsx'

test('my test', async () => {
    render(<ResultTitle title="MY TITLE"/>)
    expect(<ResultTitle></ResultTitle>).toBe("MY TITLE")
  })
  