// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {GraphQLClient, gql} from 'graphql-request';

type Data = {
	name: string;
};

const graphQlApi = typeof process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT === 'string' ? process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT : '';
const graphCmsToken = typeof process.env.GRAPHCMS_TOKEN === 'string' ? process.env.GRAPHCMS_TOKEN : '';

export default async function comments(req: NextApiRequest, res: NextApiResponse) {
	const graphQlClient = new GraphQLClient(graphQlApi, {
		headers: {
			authorization: `Bearer ${graphCmsToken}`,
		},
	});

	const query = gql`
    mutation CreateComment(
      $name: String!
      $email: String!
      $comment: String!
      $slug: String!
    ) {
      createComment(
        data: {
          name: $name
          email: $email
          comment: $comment
          post: { connect: { slug: $slug } }
        }
      ) {
        id
      }
    }
  `;
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const result = await graphQlClient.request(query, req.body);
		res.status(200).send(result);
	} catch (err) {
		console.log(err);
		res.status(500).json({error: err});
	}
}
