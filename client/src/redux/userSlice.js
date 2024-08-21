import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logInsert } from "./reportSlice";

export const getUsers = createAsyncThunk(
    "users/getUsers",
    
    async (_, thunkAPI) => {
      const { rejectWithValue, dispatch ,getState} = thunkAPI;
      const state = getState();
      const token = state.users.token;
          try {
        const res = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.status >= 400) {
          return rejectWithValue(data.message);
        }
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    const { rejectWithValue, getState, dispatch } = thunkAPI;
    try {

        // const state = getState();
        // const token = state.users.token;   

        console.log(credentials);
     
      const res = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${token}` ,          
        },
      });
      //report
     
      const data = await res.json();
      if (res.status >= 400) {
        return rejectWithValue(data.message);
      }
      console.log("data",data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('isLogedIn', true)
      localStorage.setItem("user", data?.user?._id)
      dispatch(logInsert({ name: "login", status: "success" }));
      console.log(data);
      return data;
    } catch (error) {
        console.log("here its error")
      dispatch(logInsert({ name: "login", status: "failed" }));
      return rejectWithValue(error.message);
    }
  }
);

export const subscription = createAsyncThunk(
    "users/subscription",
    async (credentials) => {
        
      try {
        const res = await fetch("http://localhost:8000/api/users/subscription", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}` ,          
          },
        });
       
        const data = await res.json();
        localStorage.setItem('isSubscribed', data.isSubscribed)
        return data;
      } catch (error) {
          
      }
    }
  );

export const register = createAsyncThunk(
  "user/register",
  async (credentials, thunkAPI) => {
    const { rejectWithValue, getState, dispatch } = thunkAPI;
    try {
      // const state = getState();
      //   const token = state.users.token;       
        const res = await fetch("http://localhost:8000/api/users/signup",
        {
          method: "POST",
          body: JSON.stringify(credentials),
          
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            // "Authorization": `Bearer ${token}` ,          
           }
        });
       
        const data = await res.json();
        if (res.status >= 400) {
          return rejectWithValue(data.message);
        }
        

        dispatch(logInsert({ name: "register", status: "success" }));

        console.log(data);
        return data;

    } catch (error) {
        dispatch(logInsert({ name: "register", status: "failed" }));
        return rejectWithValue(error.message);
    }

  }
);


const token = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null


  const isLogedIn = localStorage.getItem('isLogedIn')
  ? localStorage.getItem('isLogedIn')
  : false

const initialState = {
    isLoading: false,
    user: null,
    token,
    error: null,
    success: false,
    users: [],
    isLogedIn,
    isActive:false
  }


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token') // deletes token from storage
      localStorage.removeItem('isLogedIn') // deletes isLogedIn
      state.user = null
      state.user = null
      state.error = null
      state.isLoading = false
      state.isLogedIn =false
    },
    extraReducers: {
        // //get User
        // [getUserId.pending]: (state, action) => {
        //   state.isLoading = true;
        //   state.error = null;
        // },
    
        // [getUserId.fulfilled]: (state, action) => {
        //   state.isLoading = false;
        //   state.user = action.payload.user;
        //   state.isMember = action.payload.user.isMember
        // },
        // [getUserId.rejected]: (state, action) => {
        //   state.isLoading = false;
        //   state.error = action.payload;
        // },
    
        //get Users
        // [getUsers.pending]: (state, action) => {
        //   state.isLoading = true;
        //   state.error = null;
        // },
        // [getUsers.fulfilled]: (state, action) => {
        //   state.isLoading = false;
        //   state.users = action.payload.users;
        //   console.log( "test" ,state.users);
    
        // },
        // [getUsers.rejected]: (state, action) => {
        //   state.isLoading = false;
        //   state.error = action.payload;
        // },
    
        //login
        [login.pending]: (state, action) => {
          state.isLoading = true;
          state.error = null;
        },
        [login.fulfilled]: (state, action) => {
          state.isLoading = false;
          state.isLogedIn =true;
          state.token = action.payload.token;
          state.user= action.payload.user
          // state.user = action.payload.user
          
        },
        [login.rejected]: (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
     
        
    }
  },


}
);
export const userAction = userSlice.actions
export default userSlice.reducer;
