export interface APITemplate {
  id: string;
  name: string;
  description: string;
  category: "REST" | "GraphQL" | "WebSocket" | "gRPC";
  thumbnail: string;
  content: {
    shapes: any[];
    arrows: any[];
  };
}

export const apiDesignTemplates: APITemplate[] = [
  {
    id: "rest-crud",
    name: "REST CRUD API",
    description: "Complete REST API with CRUD operations",
    category: "REST",
    thumbnail: "🔄",
    content: {
      shapes: [
        {
          type: "box",
          id: "client",
          x: 100,
          y: 100,
          props: {
            w: 200,
            h: 80,
            text: "Client\n(Web/Mobile App)",
          },
        },
        {
          type: "box",
          id: "api",
          x: 450,
          y: 100,
          props: {
            w: 200,
            h: 300,
            text: "REST API\n\nGET /users\nPOST /users\nPUT /users/:id\nDELETE /users/:id",
          },
        },
        {
          type: "box",
          id: "db",
          x: 800,
          y: 100,
          props: {
            w: 200,
            h: 80,
            text: "Database\n(PostgreSQL)",
          },
        },
      ],
      arrows: [],
    },
  },
  {
    id: "microservices",
    name: "Microservices Architecture",
    description: "Multi-service API architecture with gateway",
    category: "REST",
    thumbnail: "🏗️",
    content: {
      shapes: [
        {
          type: "box",
          id: "gateway",
          x: 100,
          y: 200,
          props: {
            w: 200,
            h: 80,
            text: "API Gateway\n(Kong/NGINX)",
          },
        },
        {
          type: "box",
          id: "auth",
          x: 450,
          y: 50,
          props: {
            w: 180,
            h: 60,
            text: "Auth Service\n/auth/*",
          },
        },
        {
          type: "box",
          id: "users",
          x: 450,
          y: 150,
          props: {
            w: 180,
            h: 60,
            text: "User Service\n/users/*",
          },
        },
        {
          type: "box",
          id: "orders",
          x: 450,
          y: 250,
          props: {
            w: 180,
            h: 60,
            text: "Order Service\n/orders/*",
          },
        },
        {
          type: "box",
          id: "payments",
          x: 450,
          y: 350,
          props: {
            w: 180,
            h: 60,
            text: "Payment Service\n/payments/*",
          },
        },
      ],
      arrows: [],
    },
  },
  {
    id: "graphql-api",
    name: "GraphQL API",
    description: "GraphQL server with resolvers and schema",
    category: "GraphQL",
    thumbnail: "⚡",
    content: {
      shapes: [
        {
          type: "box",
          id: "client",
          x: 100,
          y: 150,
          props: {
            w: 180,
            h: 100,
            text: "GraphQL Client\n\nquery {\n  users { id, name }\n}",
          },
        },
        {
          type: "box",
          id: "server",
          x: 450,
          y: 150,
          props: {
            w: 200,
            h: 100,
            text: "GraphQL Server\n\nSchema\nResolvers\nMiddleware",
          },
        },
        {
          type: "box",
          id: "db",
          x: 800,
          y: 150,
          props: {
            w: 180,
            h: 80,
            text: "Data Sources\n(DB, APIs, Cache)",
          },
        },
      ],
      arrows: [],
    },
  },
  {
    id: "websocket-chat",
    name: "WebSocket Chat API",
    description: "Real-time chat with WebSocket connections",
    category: "WebSocket",
    thumbnail: "💬",
    content: {
      shapes: [
        {
          type: "box",
          id: "client1",
          x: 100,
          y: 100,
          props: {
            w: 150,
            h: 60,
            text: "Client 1\nWebSocket",
          },
        },
        {
          type: "box",
          id: "client2",
          x: 100,
          y: 200,
          props: {
            w: 150,
            h: 60,
            text: "Client 2\nWebSocket",
          },
        },
        {
          type: "box",
          id: "client3",
          x: 100,
          y: 300,
          props: {
            w: 150,
            h: 60,
            text: "Client 3\nWebSocket",
          },
        },
        {
          type: "box",
          id: "server",
          x: 450,
          y: 150,
          props: {
            w: 200,
            h: 150,
            text: "WebSocket Server\n\nConnect\nDisconnect\nMessage\nBroadcast",
          },
        },
        {
          type: "box",
          id: "redis",
          x: 800,
          y: 180,
          props: {
            w: 150,
            h: 80,
            text: "Redis PubSub\n(Messages)",
          },
        },
      ],
      arrows: [],
    },
  },
  {
    id: "oauth-flow",
    name: "OAuth 2.0 Authentication",
    description: "OAuth 2.0 authorization flow diagram",
    category: "REST",
    thumbnail: "🔐",
    content: {
      shapes: [
        {
          type: "box",
          id: "user",
          x: 100,
          y: 150,
          props: {
            w: 150,
            h: 60,
            text: "User\n(Browser)",
          },
        },
        {
          type: "box",
          id: "app",
          x: 350,
          y: 150,
          props: {
            w: 180,
            h: 60,
            text: "Your Application\n(Client)",
          },
        },
        {
          type: "box",
          id: "oauth",
          x: 650,
          y: 150,
          props: {
            w: 180,
            h: 60,
            text: "OAuth Provider\n(Google/GitHub)",
          },
        },
        {
          type: "text",
          id: "step1",
          x: 200,
          y: 250,
          props: {
            text: "1. Authorization Request",
          },
        },
        {
          type: "text",
          id: "step2",
          x: 500,
          y: 280,
          props: {
            text: "2. User Login & Consent",
          },
        },
        {
          type: "text",
          id: "step3",
          x: 200,
          y: 310,
          props: {
            text: "3. Authorization Code",
          },
        },
        {
          type: "text",
          id: "step4",
          x: 500,
          y: 340,
          props: {
            text: "4. Exchange Code for Token",
          },
        },
      ],
      arrows: [],
    },
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway Integration",
    description: "Payment processing flow with Stripe/PayPal",
    category: "REST",
    thumbnail: "💳",
    content: {
      shapes: [
        {
          type: "box",
          id: "customer",
          x: 100,
          y: 150,
          props: {
            w: 150,
            h: 60,
            text: "Customer\n(Checkout)",
          },
        },
        {
          type: "box",
          id: "backend",
          x: 350,
          y: 150,
          props: {
            w: 180,
            h: 100,
            text: "Your Backend\n\nCreate Payment\nVerify Payment\nWebhooks",
          },
        },
        {
          type: "box",
          id: "stripe",
          x: 650,
          y: 150,
          props: {
            w: 180,
            h: 80,
            text: "Payment Gateway\n(Stripe/PayPal)",
          },
        },
        {
          type: "box",
          id: "db",
          x: 350,
          y: 300,
          props: {
            w: 180,
            h: 60,
            text: "Database\n(Order Records)",
          },
        },
      ],
      arrows: [],
    },
  },
];
