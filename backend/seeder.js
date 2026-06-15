const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

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

const products = [
  {
    name: 'Premium Black Hoodie',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
    description: 'High quality premium black hoodie made with 100% organic cotton. Perfect for cool weather and casual streetwear look.',
    category: 'Outerwear',
    price: 89.99,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 15,
  },
  {
    name: 'Minimalist White Tee',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'],
    description: 'Classic minimalist white t-shirt. Soft, breathable, and pre-shrunk for a perfect fit.',
    category: 'T-Shirts',
    price: 34.99,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    countInStock: 25,
  },
  {
    name: 'Gold Accent Jacket',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'],
    description: 'Luxury gold accent jacket featuring custom gold zippers and button detail. Premium lining.',
    category: 'Outerwear',
    price: 129.99,
    discount: 10,
    sizes: ['M', 'L', 'XL'],
    countInStock: 8,
  },
  {
    name: 'Urban Cargo Pants',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800'],
    description: 'Rugged urban cargo pants with multi-pocket layout and adjustable ankle straps.',
    category: 'Bottoms',
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

    // Create users individually to trigger pre-save hook (bcrypt hashing)
    const createdUsers = [];
    for (const u of users) {
      const createdUser = await User.create(u);
      createdUsers.push(createdUser);
    }

    const adminUser = createdUsers[0]._id;

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
