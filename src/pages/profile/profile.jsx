import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllUsers, getTokenFromLocalStorage, getUser } from "../../api/api";
import { useAuthSelector } from "../../store/slices/auth";
import { NotFound } from "../not-found/notFound";
import { MyProfile } from "./myProfile";
import { SellerProfile } from "./sellerProfile";

export const Profile = (isLoading) => {
  const useAuth = useAuthSelector();
  const [userProfile, setUserProfile] = useState(null);
  const userID = useParams().id;
  const [pageMode, setPageMode] = useState("guest");

  const fetchData = () => {
    if (userID === "me" || parseInt(userID) === useAuth) {
      if (useAuth) {
        const token = getTokenFromLocalStorage();

        getUser(token)
          .then((data) => {
            setUserProfile(data);
            setPageMode("my-profile");
          })
          .catch(() => {
            setPageMode("error");
          });
      } else {
        setPageMode("error");
      }
    } else {
      getAllUsers()
        .then((data) => {
          if (data) {
            const findUser = (arrUsers) => {
              for (let i = 0; i < arrUsers?.length; i++) {
                if (arrUsers[i].id === parseInt(userID)) {
                  setPageMode("guest");
                  return arrUsers[i];
                }
              }
              setPageMode("error");
              return null;
            };

            setUserProfile(findUser(data));
          }
        })
        .catch(() => {
          setPageMode("error");
        });
    }
  };

  useEffect(() => {
    if (!userProfile) {
      fetchData();
    }
  }, [userID, useAuth]);
  return (
    <>
      {pageMode === "my-profile" && userProfile && (
        <MyProfile
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          isLoading={isLoading}
        />
      )}
      {pageMode === "guest" && userProfile && (
        <SellerProfile userProfile={userProfile} isLoading={isLoading} />
      )}
      {pageMode === "error" && userProfile && <NotFound />}
    </>
  );
};
