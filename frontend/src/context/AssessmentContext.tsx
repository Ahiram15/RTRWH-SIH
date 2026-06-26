import React, { createContext, useContext, useState, type ReactNode } from 'react'

export interface AssessmentData {
  consentGiven: boolean
  assessmentType: 'individual' | 'community' | null
  latitude: number | null
  longitude: number | null
  address: string
  fullName: string
  contactNumber: string
  householdSize: number
  rooftopArea: number
  openSpaceArea: number
  roofType: string
  propertyType: string
  existingWaterSources: string[]
  intendedUse: string
  buildingAge: string
  occupancy: number
  results: any | null
}

const defaultData: AssessmentData = {
  consentGiven: false,
  assessmentType: null,
  latitude: null,
  longitude: null,
  address: '',
  fullName: '',
  contactNumber: '',
  householdSize: 4,
  rooftopArea: 100,
  openSpaceArea: 20,
  roofType: 'Concrete/RCC',
  propertyType: 'Residential',
  existingWaterSources: [],
  intendedUse: 'general',
  buildingAge: 'new',
  occupancy: 4,
  results: null,
}

interface AssessmentContextType {
  data: AssessmentData
  updateData: (fields: Partial<AssessmentData>) => void
  resetData: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AssessmentData>(defaultData)

  const updateData = (fields: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...fields }))
  }

  const resetData = () => {
    setData(defaultData)
  }

  return (
    <AssessmentContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export const useAssessment = () => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider')
  }
  return context
}
