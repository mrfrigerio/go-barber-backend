import IMailProvider from '../models/IMailProvider'

interface IMessage {
  to: string
  body: string
}

export default class FakeMailProvider implements IMailProvider {
  private static messages: IMessage[] = []

  async sendMail(to: string, body: string): Promise<void> {
    FakeMailProvider.messages.push({ to, body })
  }
}
