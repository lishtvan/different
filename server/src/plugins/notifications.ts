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
  senderId: number;
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
    senderId,
  }: SendChatNotificationOpts) => {
    try {
      const sender = await instance.prisma.user.findUnique({
        where: { id: senderId },
        select: { nickname: true },
      });

      if (!sender?.nickname) return;

      await sendNotification({
        recipientId,
        title: sender.nickname,
        body: text,
        data: { type: 'msg', chatId, url: `com.lishtvan.different://chatf?chatId=${chatId}` },
      });
    } catch (error) {
      instance.log.error('Send chat notification error', error);
    }
  };

  return {
    sendChatNotification,
    sendNotification,
  };
};

export default fp(async (fastify) => {
  const notifications = notificationsPlugin(fastify);
  fastify.decorate('notifications', {
    sendChatNotification: notifications.sendChatNotification,
    isExpoPushToken: Expo.isExpoPushToken,
    sendNotification: notifications.sendNotification,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    notifications: {
      isExpoPushToken: typeof Expo.isExpoPushToken;
      sendChatNotification: ReturnType<
        typeof notificationsPlugin
      >['sendChatNotification'];
      sendNotification: ReturnType<typeof notificationsPlugin>['sendNotification'];
    };
  }
}
