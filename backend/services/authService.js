const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  generateToken(user, role) {
    return jwt.sign(
      { id: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async registerCustomer(userData) {
    const { email } = userData;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email, 'customer');
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const customer = await userRepository.createCustomer({
      ...userData,
      hashedPassword
    });

    return customer;
  }

  async loginCustomer(email, password) {
    // Find user
    const user = await userRepository.getUserWithPassword(email, 'customer');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isValidPassword = await this.comparePasswords(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async loginAdmin(email, password) {
    // Find admin
    const admin = await userRepository.getUserWithPassword(email, 'admin');
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isValidPassword = await this.comparePasswords(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return admin;
  }

  async loginManufacturer(email, password) {
    // Find manufacturer
    const manufacturer = await userRepository.getUserWithPassword(email, 'manufacturer');
    if (!manufacturer) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isValidPassword = await this.comparePasswords(password, manufacturer.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return manufacturer;
  }
}

module.exports = new AuthService();
