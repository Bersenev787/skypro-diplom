import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllUsers, getTokenFromLocalStorage, getUser } from "../../api/api";
import { useAuthSelector } from "../../store/slices/auth";
import { NotFound } from "../not-found/notFound";
import { MyProfile } from "./myProfile";
import { SellerProfile } from "./sellerProfile";

export const Profile = ({ isLoading, user }) => {
  const useAuth = useAuthSelector();
  // const useAuth = JSON.parse(localStorage.getItem("auth"));
  const [userProfile, setUserProfile] = useState(null);
  const userID = useParams().id;
  const [pageMode, setPageMode] = useState();

  const fetchMyProfileData = () => {
    const token = getTokenFromLocalStorage();
    getUser(token)
      .then((data) => {
        setUserProfile(data);
        setPageMode("my-profile");
      })
      .catch(() => {
        setPageMode("error");
      });
  };

  const fetchGuestProfileData = () => {
    getAllUsers()
      .then((data) => {
        if (data) {
          const foundUser = data.find((user) => user.id === parseInt(userID));
          if (foundUser) {
            setUserProfile(foundUser);
            setPageMode("guest");
          } else {
            setPageMode("error");
          }
        }
      })
      .catch(() => {
        setPageMode("error");
      });
  };

  useEffect(() => {
    if (userProfile && userProfile?.id !== useAuth.id && userID === "me") {
      setUserProfile(null);
    }

    if (!userProfile) {
      if (userID === "me" && useAuth) {
        fetchMyProfileData();
      } else {
        fetchGuestProfileData();
      }
    }
  }, [userID, useAuth, userProfile, pageMode, user]);

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
