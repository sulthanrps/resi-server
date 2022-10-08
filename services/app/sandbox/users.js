const axios = require("axios");
const fs = require("fs");
async function testdata() {
  const { data } = await axios.get("https://dummyjson.com/users");
  //   console.log(data.users);
  const newData = data.users.map((el, index) => {
    const randNumber = Math.floor(Math.random() * 2);
    // console.log(role[randNumber]);
    return {
      id: index + 1,
      name: `${el.firstName} ${el.maidenName} ${el.lastName}`,
      email: el.email,
      password: 123456,
      imgUrl: el.image,
      phoneNumber: el.phone,
      address: `${el.address.address}`,
      role: role[randNumber],
      balance: 0,
    };
  });
  //   console.log(newData);
  fs.writeFileSync(
    "./dummyUsers.json",
    JSON.stringify({ users: newData }, null, 2),
    "utf-8"
  );
}
const role = ["washer", "customer"];
testdata();
