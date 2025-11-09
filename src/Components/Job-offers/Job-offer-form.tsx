"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { jobOfferSchema, type JobOfferFormData } from "@/app/lib/validations/Job-offer-Schemas"
import { availableServices, type JobOffer } from "@/app/lib/mock-data"

interface JobOfferFormProps {
  onSubmit: (data: JobOfferFormData) => void
  onCancel: () => void
  defaultValues?: Partial<JobOffer> | Partial<JobOfferFormData>
  submitButtonText?: string
}

export default function JobOfferForm({
  onSubmit,
  onCancel,
  defaultValues,
  submitButtonText = "Publicar Oferta",
}: JobOfferFormProps) {
  // Normalize services to object format
  const normalizeServices = (services?: string[] | { id: string; value: string }[]) => {
    if (!services) return []
    if (typeof services[0] === 'string') {
      return (services as string[]).map((s) => ({ id: s, value: s }))
    }
    return services as { id: string; value: string }[]
  }

  const [selectedServices, setSelectedServices] = useState<Array<{ id: string; value: string }>>(
    normalizeServices(defaultValues?.services)
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      description: defaultValues?.description || "",
      city: defaultValues?.city || "Cochabamba",
      price: defaultValues?.price || 0,
      photos: defaultValues?.photos || [],
      services: normalizeServices(defaultValues?.services),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services" as const,
    rules: { required: true, minLength: 1 }
  })

  const selectedServicess = fields.map(field => field.value)
  const description = watch("description") || ""

    if (isSelected) {
      const newServices = selectedServices.filter((s) => s.value !== service)
      setSelectedServices(newServices)
      setValue("services", newServices)
    } else {
      const newServices = [...selectedServices, serviceObj]
      setSelectedServices(newServices)
      setValue("services", newServices)
    }
  }

  const handleFormSubmit = (data: JobOfferFormData) => {
    onSubmit({ ...data, services: selectedServices })
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-blue-600">
          {defaultValues ? "Editar Oferta" : "Nueva Oferta de Trabajo"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>
      </div>

       <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
        {/* Description */}
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold mb-2 items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Descripción del trabajo *
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Describe tu servicio..."
            maxLength={100}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <select
            id="city"
            {...register("city")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Cochabamba">Cochabamba</option>
            <option value="La Paz">La Paz</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="El Alto">El Alto</option>
          </select>
          {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Servicios</label>
          <div className="grid grid-cols-2 gap-2">
            {availableServices.map((service) => (
              <button
                key={service}
                className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedServicess.includes(service)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedServicess.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
          {errors.services && <p className="text-sm text-red-600">{errors.services.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (Bs)
            <span className="text-xs text-gray-500 ml-2">(máx. 10 dígitos)</span>
          </label>
          <input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="0"
            max={9999999999}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  )
}
