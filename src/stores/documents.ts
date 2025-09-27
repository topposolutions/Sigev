import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Document {
  id: string
  title: string
  type: string
  size: number
  uploadDate: Date
  lastModified: Date
  tags: string[]
  category: string
  status: 'active' | 'archived' | 'draft'
  accessLevel: 'public' | 'restricted' | 'confidential'
  downloadCount: number
  content?: string
}

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<Document[]>([
    {
      id: '1',
      title: 'Manual de Procedimentos Operacionais',
      type: 'PDF',
      size: 2048000,
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      tags: ['manual', 'procedimentos', 'operacional'],
      category: 'Operações',
      status: 'active',
      accessLevel: 'public',
      downloadCount: 45
    },
    {
      id: '2',
      title: 'Política de Segurança da Informação',
      type: 'DOCX',
      size: 1024000,
      uploadDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      tags: ['segurança', 'política', 'TI'],
      category: 'TI',
      status: 'active',
      accessLevel: 'restricted',
      downloadCount: 32
    },
    {
      id: '3',
      title: 'Relatório Anual 2023',
      type: 'PDF',
      size: 5120000,
      uploadDate: new Date('2024-01-05'),
      lastModified: new Date('2024-01-15'),
      tags: ['relatório', 'anual', 'financeiro'],
      category: 'Financeiro',
      status: 'active',
      accessLevel: 'confidential',
      downloadCount: 78
    }
  ])

  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedType = ref('')
  const isLoading = ref(false)

  const filteredDocuments = computed(() => {
    let filtered = documents.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
        doc.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory.value) {
      filtered = filtered.filter(doc => doc.category === selectedCategory.value)
    }

    if (selectedType.value) {
      filtered = filtered.filter(doc => doc.type === selectedType.value)
    }

    return filtered
  })

  const categories = computed(() => {
    const cats = new Set(documents.value.map(doc => doc.category))
    return Array.from(cats)
  })

  const documentTypes = computed(() => {
    const types = new Set(documents.value.map(doc => doc.type))
    return Array.from(types)
  })

  const totalDocuments = computed(() => documents.value.length)
  const totalDownloads = computed(() => documents.value.reduce((sum, doc) => sum + doc.downloadCount, 0))
  const recentDocuments = computed(() => 
    documents.value
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      .slice(0, 5)
  )

  const addDocument = (document: Omit<Document, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const newDoc: Document = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date(),
      downloadCount: 0
    }
    documents.value.push(newDoc)
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const index = documents.value.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents.value[index] = { ...documents.value[index], ...updates, lastModified: new Date() }
    }
  }

  const deleteDocument = (id: string) => {
    const index = documents.value.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents.value.splice(index, 1)
    }
  }

  const incrementDownloadCount = (id: string) => {
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.downloadCount++
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  const setSelectedType = (type: string) => {
    selectedType.value = type
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    selectedType.value = ''
  }

  return {
    documents,
    searchQuery,
    selectedCategory,
    selectedType,
    isLoading,
    filteredDocuments,
    categories,
    documentTypes,
    totalDocuments,
    totalDownloads,
    recentDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    incrementDownloadCount,
    setSearchQuery,
    setSelectedCategory,
    setSelectedType,
    clearFilters
  }
})