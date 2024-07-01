import { Expo } from 'expo-server-sdk';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

interface SendNotificationOpts {
  recipientId: number;
  data: object;
  title: string;
  body: string;
}

interface SendChatNotificationOpts {
  recipientId: number;
  text: string;
  senderUserName: string;
  chatId: string;
}

const notificationsPlugin = (instance: FastifyInstance) => {
  const expo = new Expo();

  const sendNotification = async ({
    recipientId,
    data,
    title,
    body,
  }: SendNotificationOpts) => {
    const recipient = await instance.prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient?.pushToken) return;
    const [ticket] = await expo.sendPushNotificationsAsync([
      { to: recipient.pushToken, sound: 'default', title, body, data },
    ]);
    if (ticket.status === 'error') {
      instance.log.error('error while sending push notification', {
        ...ticket,
        recipientId,
      });
    }
  };

  const sendChatNotification = async ({
    recipientId,
    text,
    chatId,
    senderUserName,
  }: SendChatNotificationOpts) => {
    await sendNotification({
      recipientId,
      title: senderUserName,
      body: text,
      data: { type: 'msg', chatId, url: `/chatg/${chatId}` },
    });
  };

  return {
    sendChatNotification,
  };
};

export default fp(async (fastify) => {
  const notifications = notificationsPlugin(fastify);
  fastify.decorate('notifications', {
    sendChatNotification: notifications.sendChatNotification,
    isExpoPushToken: Expo.isExpoPushToken,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    notifications: {
      isExpoPushToken: typeof Expo.isExpoPushToken;
      sendChatNotification: ReturnType<
        typeof notificationsPlugin
      >['sendChatNotification'];
    };
  }
}
