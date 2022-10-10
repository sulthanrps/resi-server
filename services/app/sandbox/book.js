const axios = require("axios");
const fs = require("fs");

// "UserId": 1,
// "BookDate": "2022-10-10",
// "GrandTotal": 60000,
// "WasherId": 1,
// "BikeId": 1,
// "scheduleId": 1,
// "status": "waiting"
async function bookData() {
  try {
    const dataStatus = ["taken", "onGoing", "paid"];
    const dataWasher = await axios.get(
      "http://localhost:3001/users?role=washer"
    );
    const dataCustomer = await axios.get(
      "http://localhost:3001/users?role=customer"
    );
    // console.log(dataWasher.data);
    const washId = dataWasher.data.map((el) => el.id);
    const custId = dataCustomer.data.map((el) => el.id);
    let data = [];
    washId.forEach((el) => {
      for (let j = 0; j < 10; j++) {
        const date = new Date();
        date.setDate(date.getDate() + j + 2);
        for (let i = 1; i <= 10; i++) {
          const randIdCust = custId[Math.floor(Math.random() * custId.length)];
          data.push({
            UserId: randIdCust,
            BookDate: formatDate(date),
            GrandTotal: 60000,
            WasherId: el,
            BikeId: Math.ceil(Math.random() * 7),
            ScheduleId: i,
            status: dataStatus[0],
          });
        }
      }
    });

    randomBetweenRange(num, range).forEach((el) => {
      delete data[el];
    });
    data = data.filter((el) => el != null);
    // console.log(data);
    randomBetweenRange(100, [1, data.length]).forEach(
      (el) => delete data[el].WasherId
    );
    fs.writeFileSync(
      "./books.json",
      JSON.stringify({ books: data }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.log(error);
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
const num = 800;
const range = [1, 1400];
const randomBetween = (a, b) => {
  return Math.floor(Math.random() * (b - a) + a);
};
const randomBetweenRange = (num, range) => {
  const res = [];
  for (let i = 0; i < num; ) {
    const random = randomBetween(range[0], range[1]);
    if (!res.includes(random)) {
      res.push(random);
      i++;
    }
  }
  return res;
};
// console.log(randomBetweenRange(num, range));

bookData();
