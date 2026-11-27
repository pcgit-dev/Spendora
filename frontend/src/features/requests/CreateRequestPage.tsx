
//Create and review request
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Send,
  CheckCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import {
  CURRENCIES,
  CATEGORIES,
} from './types'

import type { SpendRequestForm } from './types'
import { requestSchema } from './requestSchema'
import { getApprovalChain } from './approvalPolicy'
import { submitRequest } from './requestService'

const selectClass =
  'h-10 w-full rounded-md border bg-white px-3 text-sm'

const projects = [
  'Finance Transformation',
  'ERP Modernization',
  'Site Infrastructure',
  'AI Transformation',
]

const trips = [
  'Mining Conference',
  'London Business Trip',
  'Dubai Technology Conference',
]

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CreateRequestPage() {

  const navigate = useNavigate()

  const [review, setReview] =
    useState<SpendRequestForm | null>(null)

  const [submissionError, setSubmissionError] = useState('')
  const [fileError, setFileError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SpendRequestForm>({
    resolver: zodResolver(requestSchema),

    defaultValues: {
      title: '',
      currency: 'USD',
      category: 'Office Equipment',
      supplier: '',
      project: '',
      trip: '',
      justification: '',
      quoteName: '',
      noQuoteReason: '',
    },
  })

  const quoteName = useWatch({
    control,
    name: 'quoteName',
  })

  function selectQuotation(file?: File) {
    if (!file) return

    setFileError('')

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]

    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF, JPG and PNG files are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('Maximum file size is 10 MB')
      return
    }

    // Demo only: store the filename, not file contents
    setValue('quoteName', file.name, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  function confirmSubmission() {
    if (!review) return

    try {
      submitRequest(review)
      navigate('/requests')
    } catch {
      setSubmissionError(
        'Unable to save the request. Please try again.'
      )
    }
  }

  // REVIEW SCREEN
  if (review) {

    const approvalChain = getApprovalChain(review)

    return (
      <div className="mx-auto max-w-4xl space-y-6">

        <h1 className="text-2xl font-bold">
          Review Spend Request
        </h1>

        <p className="text-sm text-slate-500">
          Verify your details before submitting for approval.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>{review.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="text-3xl font-bold text-blue-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: review.currency,
              }).format(review.amount)}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {[
                ['Requester', 'Priya Sharma'],
                ['Department', 'Operations'],
                ['Category', review.category],
                ['Supplier', review.supplier || 'Not specified'],
                ['Project', review.project || 'Not applicable'],
                ['Trip', review.trip || 'Not applicable'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-slate-500">
                    {label}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}

            </div>

            <div>
              <p className="text-sm text-slate-500">
                Business justification
              </p>
              <p className="break-words">
                {review.justification}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Supporting quotation
              </p>

              <p className="break-words">
                {review.quoteName || review.noQuoteReason}
              </p>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Approvals</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {approvalChain.map((approver, index) => (
              <div
                key={approver.id}
                className="flex items-center gap-4 rounded-lg
                           border bg-slate-50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0
                                items-center justify-center
                                rounded-full bg-blue-100
                                font-semibold text-blue-700">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold">
                    {approver.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {approver.role}
                  </p>
                </div>

              </div>
            ))}

            <p className="text-sm text-slate-500">
              Spending is not authorized until all required
              approvals have been completed.
            </p>

          </CardContent>
        </Card>

        {submissionError && (
          <p role="alert" className="text-sm text-red-600">
            {submissionError}
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-3">

          <Button
            variant="outline"
            onClick={() => {
              setReview(null)
              setSubmissionError('')
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Edit Request
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={confirmSubmission}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit for Approval
          </Button>

        </div>
      </div>
    )
  }

  // CREATE REQUEST FORM
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Spend Request
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Raise a request before committing company money.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(data => setReview(data))}
        className="space-y-6"
      >

        {/* Requester information */}

        <Card>
          <CardHeader>
            <CardTitle>Requester Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">

            <div>
              <Label htmlFor="requester">Requested By</Label>
              <Input
                id="requester"
                value="Priya Sharma"
                readOnly
                className="mt-2 bg-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value="Operations"
                readOnly
                className="mt-2 bg-slate-100"
              />
            </div>

          </CardContent>
        </Card>

        {/* Expenditure details */}

        <Card>
          <CardHeader>
            <CardTitle>Expenditure Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <Field
              id="title"
              label="Request Title *"
              error={errors.title?.message}
            >
              <Input
                id="title"
                placeholder="Enter request title"
                {...register('title')}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">

              <Field
                id="amount"
                label="Total Commitment Amount *"
                error={errors.amount?.message}
              >
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field
                id="currency"
                label="Currency *"
                error={errors.currency?.message}
              >
                <select
                  id="currency"
                  className={selectClass}
                  {...register('currency')}
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="category"
                label="Category *"
                error={errors.category?.message}
              >
                <select
                  id="category"
                  className={selectClass}
                  {...register('category')}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="supplier"
                label="Supplier"
                error={errors.supplier?.message}
              >
                <Input
                  id="supplier"
                  placeholder="Supplier name"
                  {...register('supplier')}
                />
              </Field>

              <Field
                id="project"
                label="Project"
                error={errors.project?.message}
              >
                <select
                  id="project"
                  className={selectClass}
                  {...register('project')}
                >
                  <option value="">Select project</option>

                  {projects.map(project => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="trip"
                label="Trip"
                error={errors.trip?.message}
              >
                <select
                  id="trip"
                  className={selectClass}
                  {...register('trip')}
                >
                  <option value="">Select trip</option>

                  {trips.map(trip => (
                    <option key={trip} value={trip}>
                      {trip}
                    </option>
                  ))}
                </select>
              </Field>

            </div>

            <Field
              id="justification"
              label="Business Justification *"
              error={errors.justification?.message}
            >
              <Textarea
                id="justification"
                rows={4}
                placeholder="Explain why this expenditure is required"
                {...register('justification')}
              />
            </Field>

          </CardContent>
        </Card>

        {/* Supporting quotation */}

        <Card>
          <CardHeader>
            <CardTitle>Supporting Quotation</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="rounded-lg border-2 border-dashed
                            border-slate-300 bg-slate-50 p-6">

              <UploadCloud className="mx-auto mb-3
                                      h-10 w-10 text-blue-500" />

              <p className="text-center font-medium">
                Select supplier quotation
              </p>

              <p className="mb-4 text-center text-xs text-slate-500">
                PDF, JPG or PNG — maximum 10 MB
              </p>

              <Input
                type="file"
                aria-label="Select supplier quotation"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={event => {
                  selectQuotation(event.target.files?.[0])
                  event.currentTarget.value = ''
                }}
              />

              <input
                type="hidden"
                {...register('quoteName')}
              />

              {fileError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {fileError}
                </p>
              )}

            </div>

            {quoteName && (
              <div className="flex flex-wrap items-center gap-3
                              rounded-lg bg-green-50 p-3">

                <FileText className="h-5 w-5 text-green-600" />

                <span className="min-w-0 flex-1 break-words text-sm">
                  {quoteName}
                </span>

                <CheckCircle className="h-5 w-5 text-green-600" />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setValue('quoteName', '', {
                      shouldValidate: true,
                    })
                    setFileError('')
                  }}
                >
                  Remove
                </Button>

              </div>
            )}

            <Field
              id="noQuoteReason"
              label="Reason for No Quotation"
              error={errors.noQuoteReason?.message}
            >
              <Textarea
                id="noQuoteReason"
                rows={3}
                placeholder="Required if no quotation is attached"
                {...register('noQuoteReason')}
              />
            </Field>

            <p className="text-xs text-slate-500">
              Demo mode: only the selected filename is saved.
            </p>

          </CardContent>
        </Card>

        {/* Form actions */}

        <div className="flex flex-wrap justify-between gap-3">

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/requests')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Review Request
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </div>

      </form>
    </div>
  )
}
