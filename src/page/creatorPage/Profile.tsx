import React from "react";
import { Avatar, Box, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language"; // Icon for personal website

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
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      {/* User Icon */}
      <Avatar
        src={iconURL}
        sx={{
          width: 200,
          height: 200,
          border: "5px solid #fff",
        }}
      />

      {/* User Details */}
      <Box>
        <Typography variant="h5" sx={{ color: "#fff" }}>
          {name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          {email && (
            <Link
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener"
              sx={{ color: "#fff", textDecoration: "none" }}
            >
              <EmailIcon />
            </Link>
          )}
          {twitter && (
            <Link
              href={`https://twitter.com/${twitter}`}
              target="_blank"
              rel="noopener"
              sx={{ color: "#fff", textDecoration: "none" }}
            >
              <TwitterIcon />
            </Link>
          )}
          {website && (
            <Link
              href={website}
              target="_blank"
              rel="noopener"
              sx={{ color: "#fff", textDecoration: "none" }}
            >
              <LanguageIcon />
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
