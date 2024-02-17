import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromLocalStorage } from "../../api/api";
import { apiHost } from "../../api/constants";
import { setAuth } from "../slices/auth";

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: apiHost,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access_token;
      // console.debug('Использую токен из стора', { token })
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);
  // console.debug('Результат первого запроса', { result })

  if (result?.error?.status !== 401) {
    return result;
  }

  const forceLogout = () => {
    console.debug("Принудительная авторизация!");
    api.dispatch(setAuth(null));
    window.location.navigate("/login");
  };

  const { auth } = api.getState();
  // console.debug('Данные пользователя в сторе', { auth })

  if (!auth.refresh_token) {
    return forceLogout();
  }

  const refreshResult = await baseQuery(
    {
      url: "/auth/login",
      method: "PUT",
      body: {
        refresh: auth.refresh_token,
      },
    },
    api,
    extraOptions
  );

  // console.debug('Результат запроса на обновление токена', { refreshResult })
  if (!refreshResult.data.access_token) {
    return forceLogout();
  }

  api.dispatch(setAuth({ ...auth, token: refreshResult.data.access_token }));
  const retryResult = await baseQuery(args, api, extraOptions);
  if (retryResult?.error?.status === 401) {
    return forceLogout();
  }
  return retryResult;
};

export const setUserId = (userId) => {
  return {
    type: "USER_TAG",
    payload: userId,
  };
};

const DATA_TAG = {
  type: "ADS",
  id: "LIST",
};

export const userApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllAds: builder.query({
      query: () => "/ads?sorting=new",
      providesTags: [DATA_TAG],
    }),
    getAllUserAds: builder.query({
      query: (userId) => `/ads?user_id=${userId}&sorting=new`,
      providesTags: [DATA_TAG],
    }),
    getCurrentUserAds: builder.query({
      query: () => `/ads/me`,
      providesTags: [DATA_TAG],
    }),
    getAdsById: builder.query({
      query: (id) => `/ads/${id}`,
      providesTags: [DATA_TAG],
    }),
    getAddAds: builder.mutation({
      query: ({ token, ads }) => ({
        url: "/adstext",
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `${token.token_type} ${token.access_token}`,
        },
        body: JSON.stringify({
          title: ads.title,
          description: ads.description,
          price: ads.price,
        }),
      }),
      invalidatesTags: [DATA_TAG],
    }),
    getEditAds: builder.mutation({
      query: ({ id, token, ads }) => ({
        url: `/ads/${id}`,
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `${token.token_type} ${token.access_token}`,
        },
        body: JSON.stringify({
          title: ads.title,
          description: ads.description,
          price: ads.price,
        }),
      }),
      invalidatesTags: [DATA_TAG],
    }),
    postAdsImage: builder.mutation({
      query: ({ token, image, id }) => ({
        url: `/ads/${id}/image`,
        method: "POST",
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
        body: image,
      }),
      invalidatesTags: [DATA_TAG],
    }),
    deleteAds: builder.mutation({
      query: ({ id, token }) => {
        return {
          url: `/ads/${id}`,
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        };
      },
      invalidatesTags: [DATA_TAG],
    }),
    deleteAdsImages: builder.mutation({
      query: ({ image, token, id }) => {
        const url = image?.url;
        return {
          url: `/ads/${id}/image?file_url=${url}`,
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        };
      },
      invalidatesTags: [DATA_TAG],
    }),
    getAllComments: builder.query({
      query: (id) => `/ads/${id}/comments`,
      invalidatesTags: ["CMT"],
    }),
    addComment: builder.mutation({
      query: ({ token, text, id }) => ({
        url: `/ads/${id}/comments`,
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `${token.token_type} ${token.access_token}`,
        },
        body: JSON.stringify({ text }),
      }),
      invalidatesTags: [{ type: "CMT", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCurrentUserAdsQuery,
  useGetAdsByIdQuery,
  useGetAddAdsMutation,
  usePostAdsImageMutation,
  useGetAllAdsQuery,
  useGetAllUserAdsQuery,
  useGetEditAdsMutation,
  useDeleteAdsMutation,
  useDeleteAdsImagesMutation,
  useGetAllCommentsQuery,
  useAddCommentMutation,
} = userApi;
