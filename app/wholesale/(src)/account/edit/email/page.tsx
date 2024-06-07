import { Form } from './form'

type Props = {
  searchParams: {
    error: string
    error_description: string
  }
}

export default async function Page({ searchParams }: Props) {
  return <div>{searchParams.error_description ? searchParams.error_description : <Form />}</div>
}
