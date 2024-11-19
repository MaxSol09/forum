import React, { useState } from 'react'

export const Test: React.FC = () => {

  type Todo = {
    title: string,
    text: string
  }

  const [arr, setArr] = useState<Todo[]>([])

  const [title, setTitle] = useState<string>('')
  const [text, setText] = useState<string>('')

  console.log(arr)

  const create = () => {
    setArr([...arr, {title, text}])
  }

  type User = Readonly<{
    name: string,
    age: number,
    number: number,
    city: string
  }>

  const user: Pick<User, 'age' | 'name'> = {
    age: 15,
    name: 'maxSol'
  }

  const user2: Omit<User, 'city' | 'number'> = {
    age: 15,
    name: 'maxSol'
  }

  function add(x: number, y: number): number{
    return x + y
  }

  type checkType = ReturnType<typeof add>

  const test: checkType = 5

  console.log(test)

  return (
    <div>Test
          <input onChange={e => setTitle(e.target.value)} type="text" />
          <input onChange={e => setText(e.target.value)} type="text" />
          <button onClick={() => create()}>Добавить</button>
    </div>
  )
}
