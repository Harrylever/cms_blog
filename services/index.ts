import {request, gql} from 'graphql-request';
import {type PostNode, type Post, type PostResult, type Category, type CommentObj} from '../types';

const graphqlApi: string | undefined = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async (): Promise<Post[]> => {
	const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
							url
						}
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

	const results: PostResult = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query);
	const returnVal = results.postsConnection.edges;
	return returnVal;
};

type RecentPosts = {
	posts: PostNode[];
};

export const getRecentPosts = async (): Promise<RecentPosts> => {
	const query = gql`
    query GetPostDetails {
      posts(orderBy: createdAt_ASC, last: 3) {
        title
        createdAt
        featuredImage {
          url
        }
        slug
      }
    }
  `;

	const results: RecentPosts = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query);
	return results;
};

export const getSimilarPosts = async (categories: string[], slug: string): Promise<RecentPosts> => {
	const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
        last: 3
      ) {
        title
        createdAt
        featuredImage {
          url
        }
        slug
      }
    }
  `;

	const results: RecentPosts = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query, {categories, slug});
	return results;
};

type CategoriesData = {
	categories: Category[];
};

export const getCategories = async (): Promise<Category[]> => {
	const query = gql`
    query GetCategories {
      categories {
        slug
        name
      }
    }
  `;

	const result: CategoriesData = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query);
	return result.categories;
};

type SinglePost = {
	post: PostNode;
};

export const getPostDetails = async (slug: string): Promise<PostNode> => {
	const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        author {
          id
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        content {
          raw
        }
      }
    }
  `;

	const results: SinglePost = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query, {slug});
	const returnVal = results.post;
	return returnVal;
};

export const submitComment = async (obj: CommentObj) => {
	const result = await fetch('/api/comments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj),
	});

	return result.json();
};

type CommentResult = {
	comments: CommentObj[];
};

export const getComments = async (slug: string): Promise<any> => {
	const query = gql`
    query GetComments($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `;

	const result: CommentResult = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query, {slug});
	return result.comments;
};

export const getFeaturedPosts = async () => {
	const query = gql`
    query GetCategoryPost {
      posts(where: {featuredPost: true}) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

	const result: RecentPosts = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query);
	return result.posts;
};

export type AdjacentPost = {
	next: PostNode[];
	previous: PostNode[];
};

export const getAdjacentPosts = async (createdAt: string, slug: string) => {
	const query = gql`
    query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
      next:posts(
        first: 1
        orderBy: createdAt_ASC
        where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
      previous:posts(
        first: 1
        orderBy: createdAt_DESC
        where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

	const result: AdjacentPost = await request(typeof graphqlApi === 'string' ? graphqlApi : '', query, {slug, createdAt});

	return {next: result.next[0], previous: result.previous[0]};
};
