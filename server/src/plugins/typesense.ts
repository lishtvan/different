import fp from 'fastify-plugin';
import Typesense, { Client } from 'typesense';
import { LISTINGS_COLLECTION_NAME } from '../constants/typesense';
import { ListingStatus } from '@prisma/client';

export default fp(async (fastify) => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.NODE_ENV === 'local' ? 8108 : 443,
        protocol: process.env.NODE_ENV === 'local' ? 'http' : 'https',
      },
    ],
    apiKey: process.env.TYPESENSE_WRITE_API_KEY,
  });
  fastify.decorate('typesense', typesense);
  fastify.decorate('search', {
    delete: async (listingId) => {
      await typesense
        .collections(LISTINGS_COLLECTION_NAME)
        .documents(listingId.toString())
        .delete();
    },
    update: async (listing) => {
      await typesense
        .collections(LISTINGS_COLLECTION_NAME)
        .documents()
        .update({ ...listing, id: listing.id.toString() }, {});
    },
    create: async ({ listing, sellerId }) => {
      await typesense
        .collections(LISTINGS_COLLECTION_NAME)
        .documents()
        .create({ ...listing, id: listing.id.toString(), sellerId: sellerId.toString() });
    },
  });
});

interface ListingSearch {
  id: number;
  title?: string;
  size?: string;
  designer?: string;
  condition?: string;
  tags?: string[];
  category?: string;
  price?: number;
  imageUrls?: string[];
  status?: ListingStatus;
}

interface CreateListingInput {
  listing: Required<ListingSearch>;
  sellerId: number;
}

declare module 'fastify' {
  interface FastifyInstance {
    typesense: Client;
    search: {
      delete: (listingId: number) => Promise<void>;
      update: (listing: ListingSearch) => Promise<void>;
      create: (input: CreateListingInput) => Promise<void>;
    };
  }
}
