import "dotenv/config";
export const routes = [
    {
      api: "/api/signup",
      microserviceUrl: `${process.env.IDP_URL}/user/signup`,
      microserviceName: "IDP Microservice",
      methods: ["post"],
    },
    {
      api: "/api/login",
      microserviceUrl: `${process.env.IDP_URL}/user/login`,
      microserviceName: "IDP Microservice",
      methods: ["post"],
    },
    {
      api: "/api/profile",
      microserviceUrl: `${process.env.IDP_URL}/user/profile`,
      microserviceName: "IDP Microservice",
      methods: ["get"],
      isAuthenticated: true,
    },
    {
      api: "/api/profile/edit",
      microserviceUrl: `${process.env.IDP_URL}/user/profile/edit`,
      microserviceName: "IDP Microservice",
      methods: ["put"],
      isAuthenticated: true,
    },
    {
      api: "/api/videos",
      microserviceUrl: `${process.env.VIDEO_URL}/videos`,
      microserviceName: "Video_Provider",
      methods: ["get"],
    },
    {
      api: "/api/play-video/:id",
      microserviceUrl: `${process.env.VIDEO_URL}/videos/play/:id`,
      microserviceName: "Video_Provider",
      methods: ["get"],
      isAuthenticated: true,
    },
    {
      api: "/api/add-comment/:videoId",
      microserviceUrl: `${process.env.VIDEO_URL}/comments/create/:videoId`,
      microserviceName: "Video_Provider",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/update-comment/:commentId",
      microserviceUrl: `${process.env.VIDEO_URL}/comment/update/:commentId`,
      microserviceName: "Video_Provider",
      methods: ["put"],
      isAuthenticated: true,
    },
    {
      api: "/api/add-rating/:videoId",
      microserviceUrl: `${process.env.VIDEO_URL}/rating/add/:id`,
      microserviceName: "Video_Provider",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/reply-to-comment/:parentCommentId",
      microserviceUrl: `${process.env.VIDEO_URL}/comment/reply/:parentCommentId`,
      microserviceName: "Video_Provider",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/view-all-comments/:videoId",
      microserviceUrl: `${process.env.VIDEO_URL}/comment/view/:videoId`,
      microserviceName: "Video_Provider",
      methods: ["get"],
      isAuthenticated: true,
    },
  ];
  