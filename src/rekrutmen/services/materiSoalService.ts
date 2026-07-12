import { ref } from 'vue';

export type TipeSoal = 'pilihan_ganda' | 'esai' | 'voice_note';

export interface OpsiPilihan {
  label: string;
  teks: string;
}

export interface Soal {
  id: number;
  teks: string;
  tipe: TipeSoal;
  opsi?: OpsiPilihan[];
  jawabanBenar?: string;
  kunciJawaban?: string;
  audioUrl?: string;
  createdAt: string;
}

export interface Materi {
  id: number;
  nama: string;
  deskripsi: string;
  soalList: Soal[];
  createdAt: string;
}

// Data dummy awal
const materiList = ref<Materi[]>([
  {
    id: 1,
    nama: 'Psikologi',
    deskripsi: 'Tes psikologi untuk mengukur kecocokan karakter',
    soalList: [
      {
        id: 1,
        teks: 'Apa kepanjangan dari HTML?',
        tipe: 'pilihan_ganda',
        opsi: [
          { label: 'A', teks: 'Hyper Text Markup Language' },
          { label: 'B', teks: 'High Tech Modern Language' },
          { label: 'C', teks: 'Hyper Transfer Markup Language' },
          { label: 'D', teks: 'Home Tool Markup Language' }
        ],
        jawabanBenar: 'A',
        createdAt: '2025-04-01'
      },
      {
        id: 2,
        teks: 'Jelaskan konsep props di Vue.js!',
        tipe: 'esai',
        kunciJawaban: 'Props adalah cara mengirim data dari komponen parent ke child.',
        createdAt: '2025-04-01'
      }
    ],
    createdAt: '2025-04-01'
  },
  {
    id: 2,
    nama: 'Teknis',
    deskripsi: 'Tes kemampuan teknis programming',
    soalList: [
      {
        id: 3,
        teks: 'Apa output dari console.log(typeof null)?',
        tipe: 'pilihan_ganda',
        opsi: [
          { label: 'A', teks: 'null' },
          { label: 'B', teks: 'object' },
          { label: 'C', teks: 'undefined' },
          { label: 'D', teks: 'number' }
        ],
        jawabanBenar: 'B',
        createdAt: '2025-04-02'
      }
    ],
    createdAt: '2025-04-02'
  }
]);

let nextMateriId = 3;
let nextSoalId = 4;

export const useMateriSoalService = () => {
  const getAllMateri = () => materiList.value;

  const getMateriById = (id: number) => materiList.value.find(m => m.id === id);

  // Materi CRUD
  const addMateri = (data: Omit<Materi, 'id' | 'createdAt' | 'soalList'>) => {
    const newMateri: Materi = {
      id: nextMateriId++,
      nama: data.nama,
      deskripsi: data.deskripsi,
      soalList: [],
      createdAt: new Date().toISOString().slice(0, 10)
    };
    materiList.value.push(newMateri);
    return newMateri;
  };

  const updateMateri = (data: Materi) => {
    const index = materiList.value.findIndex(m => m.id === data.id);
    if (index !== -1) materiList.value[index] = data;
  };

  const deleteMateri = (id: number) => {
    materiList.value = materiList.value.filter(m => m.id !== id);
  };

  // Soal CRUD
  const addSoal = (materiId: number, data: Omit<Soal, 'id' | 'createdAt'>) => {
    const materi = materiList.value.find(m => m.id === materiId);
    if (materi) {
      const newSoal: Soal = {
        ...data,
        id: nextSoalId++,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      materi.soalList.push(newSoal);
      return newSoal;
    }
    return null;
  };

  const updateSoal = (materiId: number, soalData: Soal) => {
    const materi = materiList.value.find(m => m.id === materiId);
    if (materi) {
      const index = materi.soalList.findIndex(s => s.id === soalData.id);
      if (index !== -1) materi.soalList[index] = soalData;
    }
  };

  const deleteSoal = (materiId: number, soalId: number) => {
    const materi = materiList.value.find(m => m.id === materiId);
    if (materi) {
      materi.soalList = materi.soalList.filter(s => s.id !== soalId);
    }
  };

  return {
    getAllMateri,
    getMateriById,
    addMateri,
    updateMateri,
    deleteMateri,
    addSoal,
    updateSoal,
    deleteSoal
  };
};