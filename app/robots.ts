export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs"],
      },
    ],
    host: "https://devflow-rose.vercel.app",
  };
}
