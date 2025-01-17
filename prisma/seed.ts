import db from "@/lib/db";

const main = async () => {
  const existingAdmin = await db.user.findFirst({
    where: {
      email: "admin@app.com",
    },
  });

  if (!existingAdmin) {
    await db.user.create({
      data: {
        email: "admin@app.com",
        password: "1234",
        role: "admin",
      },
    });
    console.log("Created admin");
  } else {
    await db.user.update({
      where: { id: existingAdmin.id },
      data: {
        role: "admin",
      },
    });
    console.log("Admin already exists - updated role");
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
