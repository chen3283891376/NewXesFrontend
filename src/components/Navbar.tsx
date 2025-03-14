import * as React from 'react';
import { Container, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { checkLoggedIn } from '@/utils';
import Avatar from './Avatar';
import SearchInput from './SearchInput';
import { UserInfo } from '@/interfaces/user';
import { MessageData } from '@/interfaces/message';
import '@/styles/search.scss';

const NavbarComponent = () => {
    const [userName, setUserName] = React.useState<string>('');
    const [userAvatar, setUserAvatar] = React.useState<string>('');
    const [messageData, setMessageData] = React.useState<MessageData>(null);
    const [totalMessageCount, setTotalMessageCount] = React.useState(0);
    let userComponent: React.JSX.Element;

    const logoutEvent = async () => {
        await fetch('/passport/logout');
        location.reload();
    };

    if (checkLoggedIn()) {
        React.useEffect(() => {
            let ignore = false;
            const func = async () => {
                const response = await fetch('/api/user/info');
                const responseData: UserInfo = await response.json();
                setUserName(responseData.data.name);
                setUserAvatar(responseData.data.avatar_path);

                if (!location.pathname.includes('message.html')) {
                    const messageResponse = await fetch(`/api/messages/overview`);
                    const messageResponseData: MessageData = await messageResponse.json();
                    setMessageData(messageResponseData);
                    setTotalMessageCount(messageResponseData.data.reduce((acc, cur) => acc + cur.count, 0));
                }
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);

        userComponent = (
            <>
                {!location.pathname.includes('message.html') && (
                    <NavDropdown
                        title={
                            <>
                                消息
                                <Badge pill bg="danger" style={{ display: totalMessageCount ? 'inline' : 'none' }}>
                                    {totalMessageCount}
                                </Badge>
                            </>
                        }
                        align={'end'}
                    >
                        <NavDropdown.Item href="/message.html?category=1" target="_blank">
                            评论和回复
                            <Badge pill bg="danger" style={{ display: messageData?.data[0].count ? 'inline' : 'none' }}>
                                {messageData?.data[0].count}
                            </Badge>
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/message.html?category=5" target="_blank">
                            关注
                            <Badge pill bg="danger" style={{ display: messageData?.data[2].count ? 'inline' : 'none' }}>
                                {messageData?.data[2].count}
                            </Badge>
                        </NavDropdown.Item>
                    </NavDropdown>
                )}

                <NavDropdown title={<Avatar name={userName} avatarUrl={userAvatar} size={40} />} align={'end'}>
                    <NavDropdown.Item href="/space.html" target="_blank">
                        个人空间
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/user.html" target="_blank">
                        作品管理
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/userInfo.html" target="_blank">
                        个人信息
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutEvent}>登出</NavDropdown.Item>
                </NavDropdown>
            </>
        );
    } else {
        userComponent = <Nav.Link href="/login.html">登录</Nav.Link>;
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow">
            <Container>
                <Navbar.Brand href="/">
                    <img src={require('../static/logo.png')} width={190} height={37} alt="logo"></img>
                </Navbar.Brand>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/">主页</Nav.Link>
                        <Nav.Link href="/discover.html">发现</Nav.Link>
                        <Nav.Link href="/about.html">关于</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto" style={{ alignItems: 'center' }}>
                        <SearchInput />

                        {userComponent}

                        <NavDropdown title="创作" align={'end'}>
                            <NavDropdown.Item href="#">TurboWarp</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Python 基础</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 海龟</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 本地</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">C++</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
