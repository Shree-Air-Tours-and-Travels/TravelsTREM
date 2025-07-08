import tourImg01 from "../images/tour-img01.jpg";
import tourImg02 from "../images/tour-img02.jpg";
import tourImg03 from "../images/tour-img03.jpg";
import tourImg04 from "../images/tour-img04.jpg";
import tourImg05 from "../images/tour-img05.jpg";
import tourImg06 from "../images/tour-img06.jpg";
import tourImg07 from "../images/tour-img07.jpg";

const tours = [
  {
    id: "1",
    title: "Westminister Bridge",
    city: "London",
    distance: 300,
    price: 99,
    maxGroupSize: 10,
    desc: "this is the description",
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
      {
        name: "jhon doe",
        rating: 3.6,
      },
      {
        name: "jhon doe",
        rating: 1.6,
      },
      {
        name: "jhon doe",
        rating: 3.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg01,
    featured: true,
  },
  {
    id: "2",
    title: "Bali, Indonesia",
    city: "Indonesia",
    distance: 400,
    price: 99,
    maxGroupSize: 8,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
      {
        name: "dem doe",
        rating: 4.6,
      },
      {
        name: "sdf doe",
        rating: 4.6,
      },
      {
        name: "sdfs doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg02,
    featured: true,
  },
  {
    id: "3",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg03,
    featured: true,
  },
  {
    id: "4",
    title: "Beautiful Sunrise, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg04,
    featured: true,
  },
  {
    id: "5",
    title: "Nusa Pendia Bali, Indonesia",
    city: "Indonesia",
    distance: 500,
    price: 99,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg05,
    featured: false,
  },
  {
    id: "6",
    title: "Cherry Blossoms Spring",
    city: "Japan",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg06,
    featured: false,
  },
  {
    id: "7",
    title: "Holmen Lofoten",
    city: "France",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg07,
    featured: false,
  },
  {
    id: "8",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    address: {
      "line1": "Somewhere in Indonesia",
      "line2": "Somewhere in Indonesia",
      "city": "Bali",
      "state": "Bali",
      "zip": "12345",
      "country": "Indonesia"
    },
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg03,
    featured: false,
  },
];

export default tours;
