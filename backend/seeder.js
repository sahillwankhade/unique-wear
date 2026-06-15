const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    isAdmin: false,
  }
];

const categories = [
  {
    name: 'Male',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800',
  },
  {
    name: 'Female',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800',
  },
  {
    name: 'Oversized',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
  }
];

const products = [
  {
    name: 'Premium Black Hoodie',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
    description: 'High quality premium black hoodie made with 100% organic cotton. Perfect for cool weather and casual streetwear look.',
    category: 'Oversized',
    price: 89.99,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 15,
  },
  {
    name: 'Minimalist White Tee',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'],
    description: 'Classic minimalist white t-shirt. Soft, breathable, and pre-shrunk for a perfect fit.',
    category: 'Male',
    price: 34.99,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 25,
  },
  {
    name: 'Black T-Shirt',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800'],
    description: 'Premium black t-shirt made of 100% combed cotton, offering unmatched softness and daily wear comfort.',
    category: 'Male',
    price: 500,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 50,
  },
  {
    name: 'White T-Shirt',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'],
    description: 'Premium white t-shirt crafted for style and ease. Durable collar and perfect athletic fit.',
    category: 'Male',
    price: 500,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 50,
  },
  {
    name: 'Gold Accent Jacket',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'],
    description: 'Luxury gold accent jacket featuring custom gold zippers and button detail. Premium lining.',
    category: 'Female',
    price: 129.99,
    discount: 10,
    sizes: ['M', 'L', 'XL'],
    countInStock: 8,
  },
  {
    name: 'Urban Cargo Pants',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800'],
    description: 'Rugged urban cargo pants with multi-pocket layout and adjustable ankle straps.',
    category: 'Male',
    price: 79.99,
    discount: 0,
    sizes: ['S', 'M', 'L'],
    countInStock: 12,
  }
];

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // Create users individually to trigger pre-save hook (bcrypt hashing)
    const createdUsers = [];
    for (const u of users) {
      const createdUser = await User.create(u);
      createdUsers.push(createdUser);
    }

    const adminUser = createdUsers[0]._id;

    // Seed Categories
    await Category.insertMany(categories);

    // Seed Products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  importData();
}
