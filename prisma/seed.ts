import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create sample users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123', 12),
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  })

  const agent = await prisma.user.create({
    data: {
      email: 'agent@example.com',
      passwordHash: await bcrypt.hash('agent123', 12),
      name: 'Agent Smith',
      role: 'AGENT',
      isVerified: true,
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: await bcrypt.hash('customer123', 12),
      name: 'Customer Jane',
      role: 'CUSTOMER',
      isVerified: true,
    },
  })

  const visitor = await prisma.user.create({
    data: {
      email: 'visitor@example.com',
      passwordHash: await bcrypt.hash('visitor123', 12),
      name: 'Visitor Bob',
      role: 'VISITOR',
      isVerified: false,
    },
  })

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Beautiful Family Home',
      description: 'A beautiful 4-bedroom family home in a quiet neighborhood',
      price: 550000.00,
      beds: 4,
      baths: 2.5,
      area: 2500.00,
      areaUnit: 'SQFT',
      propertyType: 'SINGLE_FAMILY',
      yearBuilt: 2015,
      street: '123 Maple Street',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      latitude: 39.7817,
      longitude: -89.6501,
      isPublished: true,
      isPremium: true,
      agentId: agent.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Modern Downtown Condo',
      description: 'Luxury 2-bedroom condo with city views',
      price: 320000.00,
      beds: 2,
      baths: 2.0,
      area: 1200.00,
      areaUnit: 'SQFT',
      propertyType: 'CONDO',
      yearBuilt: 2020,
      street: '456 Oak Avenue',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      latitude: 39.7956,
      longitude: -89.6442,
      isPublished: true,
      isPremium: false,
      agentId: agent.id,
    },
  })

  // Create sample property media
  await prisma.propertyMedia.create({
    data: {
      propertyId: property1.id,
      url: 'https://example.com/property1-main.jpg',
      caption: 'Front view of the family home',
      isPrimary: true,
      sortOrder: 0,
    },
  })

  await prisma.propertyMedia.create({
    data: {
      propertyId: property1.id,
      url: 'https://example.com/property1-interior1.jpg',
      caption: 'Spacious living room',
      isPrimary: false,
      sortOrder: 1,
    },
  })

  await prisma.propertyMedia.create({
    data: {
      propertyId: property2.id,
      url: 'https://example.com/property2-main.jpg',
      caption: 'Living room with city view',
      isPrimary: true,
      sortOrder: 0,
    },
  })

  // Create sample bookings
  await prisma.booking.create({
    data: {
      propertyId: property1.id,
      agentId: agent.id,
      customerId: customer.id,
      startTime: new Date('2024-02-15T14:00:00Z'),
      endTime: new Date('2024-02-15T14:45:00Z'),
      status: 'CONFIRMED',
      notes: 'Please bring ID for verification',
    },
  })

  await prisma.booking.create({
    data: {
      propertyId: property2.id,
      agentId: agent.id,
      customerId: visitor.id,
      startTime: new Date('2024-02-20T10:00:00Z'),
      endTime: new Date('2024-02-20T10:30:00Z'),
      status: 'REQUESTED',
      notes: '',
    },
  })

  // Create sample payments
  await prisma.payment.create({
    data: {
      paymentIntentId: 'pi_1234567890',
      amount: 5000, // $50.00 in cents
      currency: 'usd',
      status: 'SUCCEEDED',
      paymentMethodType: 'card',
      userId: customer.id,
    },
  })

  // Create sample notifications
  await prisma.notification.create({
    data: {
      recipientId: customer.id,
      type: 'BOOKING_CONFIRMED',
      title: 'Booking Confirmed',
      message: 'Your booking for Beautiful Family Home has been confirmed for February 15, 2024 at 2:00 PM.',
      relatedEntityId: property1.id,
      relatedEntityType: 'Property',
      isRead: false,
    },
  })

  // Create sample favorites
  await prisma.favorite.create({
    data: {
      userId: customer.id,
      propertyId: property1.id,
    },
  })

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })