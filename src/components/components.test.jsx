import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  FileUpload,
  Input,
  Modal,
  Select,
  StatusBadge,
  Table,
  TagInput,
  ToastProvider,
} from './index'
import { useToast } from '@/hooks/useToast'

describe('Button', () => {
  it('click chalta hai aur loading me disabled hota hai', () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Save</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(
      <Button onClick={onClick} loading>
        Save
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})

describe('Input / Select', () => {
  it('label aur error jodta hai', () => {
    render(<Input label="Email" error="Required" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('select options dikhata hai', () => {
    render(<Select label="Role" placeholder="Choose" options={[{ value: 'a', label: 'A' }]} />)
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument()
  })
})

describe('Modal / ConfirmDialog', () => {
  it('open na ho to kuch nahi dikhata, Escape par band hota hai', () => {
    const onClose = vi.fn()
    const { rerender } = render(<Modal open={false} onClose={onClose} title="T" />)
    expect(screen.queryByRole('dialog')).toBeNull()
    rerender(<Modal open onClose={onClose} title="T" />)
    expect(screen.getByRole('dialog', { name: 'T' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('confirm aur cancel callbacks', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Delete?" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onConfirm).toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('StatusBadge / EmptyState', () => {
  it('status ko readable label deta hai', () => {
    render(<StatusBadge status="pending_review" />)
    expect(screen.getByText('Pending review')).toBeInTheDocument()
  })

  it('empty state title dikhata hai', () => {
    render(<EmptyState title="No jobs" />)
    expect(screen.getByText('No jobs')).toBeInTheDocument()
  })
})

describe('Table', () => {
  const columns = [{ key: 'name', header: 'Name' }]

  it('rows aur pagination dikhata hai', () => {
    const onPageChange = vi.fn()
    render(
      <Table
        columns={columns}
        rows={[{ id: 1, name: 'SBI' }]}
        pagination={{ page: 1, perPage: 10, total: 25, onPageChange }}
      />,
    )
    expect(screen.getByText('SBI')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('rows na hon to empty state', () => {
    render(<Table columns={columns} rows={[]} emptyTitle="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })
})

describe('TagInput', () => {
  it('Enter se tag add hota hai, duplicate nahi', () => {
    function Wrapper() {
      const [tags, setTags] = useState([])
      return <TagInput label="Skills" value={tags} onChange={setTags} />
    }
    render(<Wrapper />)
    const input = screen.getByLabelText('Skills')
    fireEvent.change(input, { target: { value: 'React' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'react' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getAllByText(/react/i)).toHaveLength(1)
  })
})

describe('FileUpload', () => {
  it('badi file reject hoti hai', () => {
    const onSelect = vi.fn()
    const { container } = render(<FileUpload maxSizeMB={1} onSelect={onSelect} />)
    const big = new File([new Uint8Array(2 * 1024 * 1024)], 'big.pdf')
    fireEvent.change(container.querySelector('input[type=file]'), { target: { files: [big] } })
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByText(/1 MB se chhoti/)).toBeInTheDocument()
  })
})

describe('Toast', () => {
  it('message dikhta hai', () => {
    function Trigger() {
      const toast = useToast()
      return <button onClick={() => toast.success('Saved!')}>go</button>
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    act(() => fireEvent.click(screen.getByText('go')))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })
})
