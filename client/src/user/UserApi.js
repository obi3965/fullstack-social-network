import { API } from "../urlConfig"


export const read = (userId, token) => {
   return fetch(`${API}/user/${userId}`, {
       method: "GET",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
   })
   .then(response => {
       return response.json()
   })
   .catch(err => {
       console.log(err)
   })
}

export const update = (userId, token, user) => {
    console.log("USER DATA UPDATE: ", user);
    return fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
         Accept: "application/json",
         Authorization: `Bearer ${token}`
     },
     body: user
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
 }


 export const remove = (userId, token) => {
    
    return fetch(`${API}/user/${userId}`, {
        method: "DELETE",
        headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
     }
    
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
 }


 export const list = () => {
     const data = {
       methods: "GET"
     }
     return fetch(`${API}/users`, data)
     .then(response => {
         return response.json()
     }) 
     .catch(err => {
       console.log(err);
     })
 }