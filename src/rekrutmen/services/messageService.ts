import { useAuthStore } from '../../auth/stores/useAuthStore';
import type { Message } from '../types/message.types';

const BASE_URL = 'http://localhost:3000/api';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {

  const authStore = useAuthStore();

  const token = authStore.token;


  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`,
        ...(options?.headers || {})
      }
    }
  );


  const data = await response.json();


  if(!response.ok){
    console.log("API ERROR:", data);
    throw new Error(data.message);
  }


  return data;

}



export async function getMessages(){

 const res = await request<{
   success:boolean;
   data: Message[];
 }>(
  "/rekrutmen/messages",
  {
    method:"GET"
  }
 );


 return res.data;

}


export async function markAsRead(
  id:string
){

  await request(
    `/rekrutmen/messages/${id}/read`,
    {
      method:'PATCH'
    }
  );

}