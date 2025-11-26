import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager


def test_create_complaint():
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

    try:
        # 1. Acessar tela de login
        driver.get("http://localhost:3000/login")
        time.sleep(2)

        # 2. Digitar email
        driver.find_element(By.ID, "user-email").send_keys("user@test.com")

        # 3. Digitar senha
        driver.find_element(By.ID, "user-password").send_keys("teste123")

        # 4. Clicar em Entrar
        driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar')]").click()
        time.sleep(3)

        print("Login realizado com sucesso!")

        # 5. Clicar em Nova Reclamação
        driver.find_element(By.XPATH, "//a[contains(text(), 'Nova Reclamação')]").click()
        time.sleep(2)

        # 6. Inserir título da reclamação
        driver.find_element(By.ID, "title").send_keys("Produto com defeito — Selenium Test")
        time.sleep(1)

        # 7. Buscar empresa "Testing Selenium"
        campo_empresa = driver.find_element(By.ID, "company-search")
        campo_empresa.send_keys("Testing Selenium")
        time.sleep(1)

        # 8. Clicar na empresa listada
        driver.find_element(By.XPATH, "//button[contains(., 'Testing Selenium')]").click()
        time.sleep(1)

        # 9. Clicar em Próximo
        driver.find_element(By.XPATH, "//button[contains(text(), 'Próximo')]").click()
        time.sleep(2)

        # 10. Preencher descrição (mais de 50 caracteres)
        descricao = (
            "Comprei um produto que apresentou defeito após poucos dias de uso. "
            "A empresa não ofereceu suporte adequado e preciso de uma solução urgente."
        )
        driver.find_element(By.ID, "description").send_keys(descricao)
        time.sleep(1)

        # 11. Enviar Reclamação
        driver.find_element(
            By.XPATH, "//button[contains(text(), 'Enviar Reclamação')]"
        ).click()
        time.sleep(4)

        print("Reclamação enviada com sucesso!")

    finally:
        driver.quit()


if __name__ == "__main__":
    test_create_complaint()
