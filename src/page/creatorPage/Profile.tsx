import React from "react";
import { Avatar, Box, Typography, Link } from "@mui/material";

type ProfileProps = {
  name: string;
  email: string;
  twitter: string;
  website: string;
  iconURL: string;
  bannerURL: string;
};

const Profile: React.FC<ProfileProps> = ({
  name,
  email,
  twitter,
  website,
  iconURL,
  bannerURL,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Border Box */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          overflow: "hidden",
        }}
      >
        {/* Blurred Banner */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${bannerURL})`,
            backgroundSize: "cover",
            filter: "blur(10px)",
          }}
        />
      </Box>

      {/* User Icon */}
      <Avatar
        src={iconURL}
        sx={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 200,
          zIndex: 1,
          border: "5px solid #fff",
        }}
      />

      {/* User Details */}
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, 0)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff" }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff" }}>
          {email}
        </Typography>
        <Link
          href={`https://twitter.com/${twitter}`}
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Twitter: @{twitter}
        </Link>
        <Typography variant="body2" sx={{ color: "#fff" }}>
          Website: {website}
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;
